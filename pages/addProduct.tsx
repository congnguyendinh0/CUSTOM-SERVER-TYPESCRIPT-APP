import React, { useState, useCallback } from "react";
import Link from "next/link";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import {
  Banner,
  Page,
  Layout,
  Form,
  TextField,
  PageActions
} from "@shopify/polaris";

const CREATE_PRODUCT: any = gql`
  mutation productCreate($input: ProductInput!) {
    productCreate(input: $input) {
      product {
        id
        title
        descriptionHtml
        images(first: 3) {
          edges {
            node {
              altText
              originalSrc
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const AddProduct = (props: any) => {
  const [title, setTitle] = useState("");

  const handleTitle = useCallback(newValue => setTitle(newValue), []);

  return (
    <div>
      <Mutation mutation={CREATE_PRODUCT}>
        {(handleSubmit: any, { error, data }: any) => {
          const showError: any = error && (
            <Banner status="critical">{error.message}</Banner>
          );
          const showSuccess: any = data && data.productCreate && (
            <Banner status="success" onDismiss={() => console.log("wow")}>
              Product added!
            </Banner>
          );
          return (
            <div>
              <div>
                {showError}
                {showSuccess}
                
              </div>
              <div>
                <Page>
                  <Layout>
                    <Form onSubmit={() => console.log("log")}>
                      <TextField label="Title" onChange={handleTitle} />
                      <PageActions
                        primaryAction={{
                          content: "Save",
                          onAction: () => {
                            const productInput = {
                              // descriptionHtml: draftToHtml(convertToRaw(editorState.getCurrentContent())),
                              title: title
                              // tags: tags.replace(/ /g, "").split(','),
                              // SAimages: images
                            };
                            console.log(productInput);
                            handleSubmit({
                              variables: {
                                input: productInput
                              }
                            });
                          }
                        }}
                      />
                    </Form>
                  </Layout>
                </Page>
              </div>
            </div>
          );
        }}
      </Mutation>
    </div>
  );
};

export default AddProduct;
