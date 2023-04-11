import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const productApi = createApi({
  reducerPath: "menuItemApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://35.88.42.154/api/"
  }),
  tagTypes: ["MenuItems"],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => ({
        url: "products",
      }),
      providesTags: ["MenuItems"],
    }),
    getProductById: builder.query({
      query: (id) => ({
        url: `products/${id}`,
      }),
      providesTags: ["MenuItems"],
    }),
    createProduct: builder.mutation({
      query: (data1) => ({
        url: "products",
        method: "POST",
        body: data1,
        headers: {
          "Content-type": "application/json",
        },
      }),
      invalidatesTags: ["MenuItems"],
    }),
    updateProduct: builder.mutation({
      query: ({ data, id }) => ({
        url: "products/" + id,
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: data,
      }),
     invalidatesTags: ["MenuItems"],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: "products/" + id,
        method: "DELETE",
      }),
       invalidatesTags: ["MenuItems"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
export default productApi;
