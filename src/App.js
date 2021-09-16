import React from "react";
import gql from "graphql-tag";
import { Mutation, ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createUploadLink } from "apollo-upload-client";
import { ApolloLink } from "apollo-link";
import { onError } from "apollo-link-error";

export const UPLOAD_FILE = gql`
  mutation uploadFile($file: Upload!) {
    uploadFile(file: $file) {
      filename
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
          {(uploadFile) => (
            <input
              type="file"
              required
              onChange={({
                target: {
                  validity,
                  files: [file],
                },
              }) => validity.valid && uploadFile({ variables: { file } })}
            />
          )}
        </Mutation>
      </ApolloProvider>
    </div>
  );
}
export default App;
