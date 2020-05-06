const checkRole = require('../../policies/checkRole');
const Quote = require('../../content-blocks/Quote');
const CallToAction = require('../../content-blocks/CallToAction');

module.exports = {
  slug: 'pages',
  labels: {
    singular: 'Page',
    plural: 'Pages',
  },
  useAsTitle: 'title',
  policies: {
    // options: create, read, update, delete
    // null or undefined policies will default to requiring auth
    // any policy can use req.user to see that the user is logged
    create: null,
    read: () => true,
    update: ({ req: { user } }) => checkRole(['user', 'admin'], user),
    destroy: ({ req: { user } }) => checkRole(['user', 'admin'], user),
  },
  fields: [
    {
      name: 'title',
      label: 'Page Title',
      type: 'text',
      unique: true,
      localized: true,
      maxLength: 100,
      required: true,
    },
    {
      name: 'content',
      label: 'Content',
      type: 'textarea',
      localized: true,
      height: 100,
      required: true,
    },
    {
      name: 'category',
      label: 'Localized Category',
      type: 'relationship',
      relationType: 'reference',
      relationTo: 'categories',
      hasMany: false,
      localized: true,
    },
    {
      name: 'categories',
      label: 'Categories hasMany',
      type: 'relationship',
      relationType: 'reference',
      relationTo: 'categories',
      hasMany: true,
      localized: true,
    },
    {
      name: 'nonLocalizedCategory',
      label: 'Non-Localized Category',
      type: 'relationship',
      relationType: 'reference',
      relationTo: 'categories',
      hasMany: false,
      localized: false,
    },
    {
      name: 'image',
      label: 'Image',
      type: 'upload',
      required: false,
    },
    {
      name: 'otherDate',
      type: 'date',
      label: 'Example Start Date',
      width: 50,
      useTime: true,
    },
    {
      name: 'slides',
      label: 'Slides',
      singularLabel: 'Slide',
      type: 'repeater',
      fields: [
        {
          name: 'cards',
          label: 'Cards',
          singularLabel: 'Card',
          type: 'repeater',
          fields: [
            {
              name: 'cardNumber',
              type: 'text',
              label: 'Card Number',
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Description',
              condition: (fields, siblings) => {
                return (siblings.cardNumber && siblings.cardNumber.value);
              },
              hooks: {
                afterRead: operation => operation.value,
              },
            },
          ],
        },
        {
          name: 'title',
          type: 'text',
          label: 'Title',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
        },
      ],
    },
    {
      name: 'layout',
      label: 'Layout Blocks',
      singularLabel: 'Block',
      type: 'flexible',
      blocks: [Quote, CallToAction],
      localized: true,
    },
    {
      label: 'Meta Information',
      type: 'group',
      name: 'meta',
      fields: [
        {
          name: 'title',
          type: 'text',
          maxLength: 100,
          label: 'Title',
          width: 50,
          required: true,
          hooks: {
            afterRead: operation => operation.value,
          },
        },
        {
          name: 'keywords',
          type: 'text',
          maxLength: 100,
          label: 'Keywords',
          width: 50,
        },
        {
          name: 'desc',
          type: 'textarea',
          label: 'Description',
          height: 100,
        },
      ],
    },
  ],
  // components: {
  //   views: {
  //     List: path.resolve(__dirname, 'components/List/index.js'),
  //   },
  // },
  timestamps: true,
};
