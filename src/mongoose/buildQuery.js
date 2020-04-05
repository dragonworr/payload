/* eslint-disable no-restricted-syntax */
const mongoose = require('mongoose');

const validOperators = ['like', 'in', 'all', 'not_in', 'greater_than_equal', 'greater_than', 'less_than_equal', 'less_than', 'not_equals', 'equals'];

function addSearchParam(key, value, searchParams) {
  return {
    ...searchParams,
    [key]: value,
  };
}

class ParamParser {
  constructor(model, rawParams, locale) {
    this.parse = this.parse.bind(this);
    this.model = model;
    this.rawParams = rawParams;
    this.locale = locale;
    this.query = {
      searchParams: {},
      sort: false,
    };
  }

  getLocalizedKey(key, schemaObject) {
    return `${key}${(schemaObject && schemaObject.localized) ? `.${this.locale}` : ''}`;
  }

  // Entry point to the ParamParser class
  async parse() {
    for (const key of Object.keys(this.rawParams)) {
      if (key === 'where') {
        // We need to determine if the whereKey is an AND, OR, or a schema path
        for (const rawRelationOrPath of Object.keys(this.rawParams[key])) {
          const relationOrPath = rawRelationOrPath.toLowerCase();

          if (relationOrPath === 'and') {
            this.query.searchParams.$and = {};
            // Loop over all AND operations and add them to the $AND search param
          } else if (relationOrPath === 'or') {
            this.query.searchParams.$or = {};
            // Loop over all AND operations and add them to the $AND search param
          } else {
            // It's a path - and there can be multiple comparisons on a single path.
            // For example - title like 'test' and title not equal to 'tester'
            // So we need to loop on keys again here to grab operators
            const pathOperators = this.rawParams[key][relationOrPath];

            if (typeof pathOperators === 'object') {
              for (const operator of Object.keys(pathOperators)) {
                const [searchParamKey, searchParamValue] = await this.buildSearchParam(this.model.schema, relationOrPath, pathOperators[operator], operator);
                this.query.searchParams = addSearchParam(searchParamKey, searchParamValue, this.query.searchParams);
              }
            }
          }
        }
      } else if (key === 'sort') {
        this.query.sort = this.rawParams[key];
      }
    }

    return this.query;
  }

  // Checks to see
  async buildSearchParam(schema, key, val, operator) {
    let schemaObject = schema.obj[key];
    const localizedKey = this.getLocalizedKey(key, schemaObject);

    if (key.includes('.')) {
      const paths = key.split('.');
      schemaObject = schema.obj[paths[0]];
      const localizedPath = this.getLocalizedKey(paths[0], schemaObject);
      const path = schema.paths[localizedPath];

      // If the schema object has a dot, split on the dot
      // Check the path of the first index of the newly split array
      // If it's an array OR an ObjectID, we need to recurse

      if (path) {
        // If the path is an ObjectId with a direct ref,
        // Grab it
        let { ref } = path.options;

        // If the path is an Array, grab the ref of the first index type
        if (path.instance === 'Array') {
          ref = path.options && path.options.type && path.options.type[0].ref;
        }

        // //////////////////////////////////////////////////////////////////////////
        // TODO:
        //
        // Need to handle relationships that have more than one type.
        // Right now, this code only handles one ref. But there could be a
        // refPath as well, which could allow for a relation to multiple types.
        // In that case, we would need to get the allowed referenced models
        // and run the subModel query on each - building up a list of $in IDs.
        // //////////////////////////////////////////////////////////////////////////

        if (ref) {
          const subModel = mongoose.model(ref);
          let subQuery = {};

          const localizedSubKey = this.getLocalizedKey(paths[1], subModel.schema.obj[paths[1]]);
          const [searchParamKey, searchParamValue] = await this.buildSearchParam(subModel.schema, localizedSubKey, val, operator);
          subQuery = addSearchParam(searchParamKey, searchParamValue, subQuery, subModel.schema);

          const matchingSubDocuments = await subModel.find(subQuery);

          return [localizedPath, {
            $in: matchingSubDocuments.map(subDoc => subDoc.id),
          }];
        }
      }
    }

    let formattedValue = val;

    if (operator && validOperators.includes(operator)) {
      switch (operator) {
        case 'greater_than_equal':
          formattedValue = { $gte: val };
          break;

        case 'less_than_equal':
          formattedValue = { $lte: val };
          break;

        case 'less_than':
          formattedValue = { $lt: val };
          break;

        case 'greater_than':
          formattedValue = { $gt: val };
          break;

        case 'in':
        case 'all':
          formattedValue = { [`$${operator}`]: val.split(',') };
          break;

        case 'not_in':
          formattedValue = { $nin: val.split(',') };
          break;

        case 'not_equals':
          formattedValue = { $ne: val };
          break;

        case 'like':
          formattedValue = { $regex: val, $options: '-i' };
          break;

        default:
          formattedValue = val;
          break;
      }
    }

    return [localizedKey, formattedValue];
  }
}

// This plugin asynchronously builds a list of Mongoose query constraints
// which can then be used in subsequent Mongoose queries.
function buildQueryPlugin(schema) {
  const modifiedSchema = schema;

  async function buildQuery(rawParams, locale) {
    const paramParser = new ParamParser(this, rawParams, locale);
    const params = await paramParser.parse();
    return params.searchParams;
  }

  modifiedSchema.statics.buildQuery = buildQuery;
}

module.exports = buildQueryPlugin;
