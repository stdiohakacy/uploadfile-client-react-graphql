import React from "react";
import gql from "graphql-tag";
import { Mutation, ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createUploadLink } from "apollo-upload-client";
import { ApolloLink } from "apollo-link";
import { onError } from "apollo-link-error";

export const UPLOAD_FILE = gql`
  mutation uploadReportReviewFile($file: Upload!, $orderItemId: String!, $reportReviewId: String!) {
    uploadReportReviewFile(file: $file, orderItemId: $orderItemId, reportReviewId: $reportReviewId) {
      success
    }
  }
`;

//create apollo client
const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );
      if (networkError) console.log(`[Network error]: ${networkError}`);
    }),
    new createUploadLink({ uri: "http://localhost:3001/graphql" }),
  ]),
  cache: new InMemoryCache(),
});
function App() {
  return (
    <div className="App">
      <ApolloProvider client={client}>
        <Mutation mutation={UPLOAD_FILE}>
          {(uploadReportReviewFile) => (
            <input
              type="file"
              required
              onChange={({
                target: {
                  validity,
                  files: [file],
                },
              }) => validity.valid && uploadReportReviewFile({ variables: { file, 
                orderItemId: "5f54e64d-65d7-4877-bfce-1e2f822b993a", 
                reportReviewId: "e590673d-d697-4729-8abc-44680c43b6b3" } })}
            />
          )}
        </Mutation>
      </ApolloProvider>
    </div>
  );
}
export default App;
