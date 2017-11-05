## GraphQL with React, with Graphcool  Backend

> Sat, 4 Nov 2017 at 20:15:13 MYT
> ***Source:*** *[https://www.howtographql.com/react-apollo](https://www.howtographql.com/react-apollo)*

- graphcool: service that provides production ready graphql api out of the box
- Apollo abstracts away all lower-lever networking logic and provides a nice interface to the GraphQL API
- two types that you'll find in every `project.graphcool` file: `File` & `User`
- use `apollographql/graphql-tag` to parse graphql schema
- the **common 3 steps** to create query/mutation component are:
    1. write the query/mutation as a JS constant using the `gql` parser function. ie:

        ```
        const ALL_LINKS_QUERY = gql` // ← `gql` parser
           // graphql schema (query type)
           query AllLinksQuery {
              allLinks {
                 id
                 createdAt
                 url
                 description
              }
           }
        `
        ```
    2. use the `graphql` container to wrap your component with the query/mutation. ie:

        ```
        // 1. `ALL_LINKS_QUERY` is our graphql schema
        // 2. `allLinksQuery` is the prop that will get injected by `graphql` into our component
        // 3. `LinkList` is the name of our component
        export default graphql(ALL_LINKS_QUERY, {name: 'allLinksQuery'})(LinkList)
        ```
    3. use the query prop (or function, for mutation) that gets injected by `graphql()` into the component as props

> `await` may only be used in functions marked with the `async` keyword

- to check if your graphql `subscription` is working with graphcool, open one playground and run your subcsription query and then open another playground to run a query that will trigger the subscription

---
***Sidenote***: if you are using sublime and the autoclose tag or tab-trigger is not working in your jsx file, try this solutions:

- from wesbos (for tab-trigger): [https://gist.github.com/wesbos/2bb4a6998635df97c748](https://gist.github.com/wesbos/2bb4a6998635df97c748)
- from stackoverflow: [https://stackoverflow.com/questions/30027755/autocomplete-html-tags-in-jsx-sublime-text](https://stackoverflow.com/questions/30027755/autocomplete-html-tags-in-jsx-sublime-text)
