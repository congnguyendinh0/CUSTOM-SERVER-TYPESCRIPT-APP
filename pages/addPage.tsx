import React from "react";
import Link from "next/link";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import { DocumentNode } from "graphql";
import { Banner } from "@shopify/polaris";

const CREATE_PAGE: DocumentNode = gql`
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

const AddPage = (props: any) => {
  return (
    <div>
      <Mutation mutation={CREATE_PAGE}>
        {(handleSubmit: any, { error, data }: any) => {
          const showError = error && (
            <Banner status="critical">{error.message}</Banner>
          );
          const showSuccess =
            data &&
            data.createPage(<Banner status="success">Created Page!</Banner>);
          return (
            <div>
              {showError}
              {showSuccess}
              {/**
               * Page form with title, html blog thing ... , images
               * And submit
               */}
            </div>
          );
        }}
      </Mutation>
    </div>
  );
};

export default AddPage;
