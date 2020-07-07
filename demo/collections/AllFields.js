const checkRole = require('../policies/checkRole');
const Email = require('../content-blocks/Email');
const Quote = require('../content-blocks/Quote');
const NumberBlock = require('../content-blocks/Number');
const CallToAction = require('../content-blocks/CallToAction');

const AllFields = {
  slug: 'all-fields',
  labels: {
    singular: 'All Fields',
    plural: 'All Fields',
  },
  useAsTitle: 'text',
  preview: (doc, token) => {
    if (doc && doc.text) {
      return `http://localhost:3000/previewable-posts/${doc.text.value}?preview=true&token=${token}`;
    }

    return null;
  },
  policies: {
    read: () => true,
  },
  fields: [
    {
      name: 'text',
      type: 'text',
      label: 'Text',
      required: true,
      defaultValue: 'Default Value',
      unique: true,
      policies: {
        create: () => {
          console.log('trying to set text');
          return false;
        },
        update: ({ req: { user } }) => {
          const result = checkRole(['admin'], user);
          return result;
        },
        read: ({ req: { user } }) => Boolean(user),
      },
    },
    {
      name: 'image',
      type: 'upload',
      label: 'Image',
      relationTo: 'media',
    },
    {
      name: 'select',
      label: 'Select',
      type: 'select',
      options: [{
        value: 'option-1',
        label: 'Option 1 Label',
      }, {
        value: 'option-2',
        label: 'Option 2 Label',
      }, {
        value: 'option-3',
        label: 'Option 3 Label',
      }, {
        value: 'option-4',
        label: 'Option 4 Label',
      }],
      defaultValue: 'option-1',
      required: true,
    },
    {
      name: 'selectMany',
      label: 'Select w/ hasMany',
      type: 'select',
      options: [{
        value: 'option-1',
        label: 'Option 1 Label',
      }, {
        value: 'option-2',
        label: 'Option 2 Label',
      }, {
        value: 'option-3',
        label: 'Option 3 Label',
      }, {
        value: 'option-4',
        label: 'Option 4 Label',
      }],
      defaultValue: 'option-1',
      required: true,
      hasMany: true,
    },
    {
      name: 'radioGroupExample',
      label: 'Radio Group Example',
      type: 'radio',
      options: [{
        value: 'option-1',
        label: 'Options 1 Label',
      }, {
        value: 'option-2',
        label: 'Option 2 Label',
      }, {
        value: 'option-3',
        label: 'Option 3 Label',
      }],
      defaultValue: 'option-2',
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'email',
          label: 'Email',
          type: 'email',
        }, {
          name: 'number',
          label: 'Number',
          type: 'number',
        },
      ],
    },
    {
      type: 'group',
      label: 'Group',
      name: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'nestedText1',
              label: 'Nested Text 1',
              type: 'text',
            }, {
              name: 'nestedText2',
              label: 'Nested Text 2',
              type: 'text',
            },
          ],
        },
      ],
    },
    {
      type: 'repeater',
      label: 'Repeater',
      name: 'repeater',
      minRows: 2,
      maxRows: 4,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'repeaterText1',
              label: 'Repeater Text 1',
              type: 'text',
              required: true,
            }, {
              name: 'repeaterText2',
              label: 'Repeater Text 2',
              type: 'text',
              required: true,
              policies: {
                read: ({ req: { user } }) => Boolean(user),
                update: ({ req: { user } }) => {
                  return checkRole(['admin'], user);
                },
              },
            },
          ],
        },
        {
          type: 'text',
          name: 'repeaterText3',
          label: 'Repeater Text 3',
          readOnly: true,
        },
      ],
    },
    {
      type: 'flexible',
      label: 'Flexible Content',
      name: 'flexible',
      minRows: 2,
      singularLabel: 'Block',
      blocks: [Email, NumberBlock, Quote, CallToAction],
      localized: true,
      required: true,
      timestamps: true,
    },
    {
      type: 'relationship',
      label: 'Relationship to One Collection',
      name: 'relationship',
      relationTo: 'conditions',
    },
    {
      type: 'relationship',
      label: 'Relationship hasMany',
      name: 'relationshipHasMany',
      relationTo: 'localized-posts',
      hasMany: true,
    },
    {
      type: 'relationship',
      label: 'Relationship to Multiple Collections',
      name: 'relationshipMultipleCollections',
      relationTo: ['localized-posts', 'conditions'],
    },
    {
      type: 'textarea',
      label: 'Textarea',
      name: 'textarea',
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      position: 'sidebar',
    },
    {
      name: 'checkbox',
      type: 'checkbox',
      label: 'Checkbox',
      position: 'sidebar',
    },
  ],
  timestamps: true,
};

module.exports = AllFields;
