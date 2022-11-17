export default {
  name: "dish",
  title: "Dish",
  type: "document",
  fields: [
    {
      name: "name",
      title: "title",
      type: "string",
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 90,
      },
    },
    {
      name: "images",
      title: "Images",
      type: "array",
      of: [{ type: "image" }],
      options: {
        hotspot: true,
      },
    },
    {
      name: "price",
      title: "Price",
      type: "number",
    },
    {
      name: "perPiece",
      title: "Per piece",
      type: "boolean",
    },
    {
      name: "description",
      title: "Description",
      type: "text",
    },
    {
      name: "options",
      title: "Options",
      type: "array",
      of: [{ type: "string" }],
    },
  ],
  initialValue: {
    perPiece: false,
  },
}
