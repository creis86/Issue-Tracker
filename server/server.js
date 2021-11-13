import express from "express";
import fs from "fs";
import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language/index.js";
import { ApolloServer, UserInputError } from "apollo-server-express";

let aboutMessage = "Issue Tracker API v1.0";

const issuesDB = [
    {
        id: 1,
        status: "New",
        owner: "Ravan",
        effort: 5,
        created: new Date("2021/11/04"),
        due: undefined,
        title: "Error in console when clicking Add"
    },
    {
        id: 2,
        status: "Assigned",
        owner: "Eddie",
        effort: 14,
        created: new Date("2021/10/29"),
        due: new Date("2021/11/12"),
        title: "Missing bottom border on panel"
    }
];

const GraphQLDate = new GraphQLScalarType({
    name: "GraphQLDate",
    description: "A Date() type in GraphQL as a scalar",

    serialize(value) {
        return value.toISOString();
    },

    parseValue(value) {
        const dateValue = new Date(value);
        return isNaN(dateValue) ? undefined : dateValue;
    },

    parseLiteral(ast) {
        if(ast.kind === Kind.STRING) {
            const dateValue = new Date(ast.value);
            return isNaN(dateValue) ? undefined : dateValue;
        }
    }
});

const resolvers = {
    Query: {
        about: () => aboutMessage,
        issueList
    },
    Mutation: {
        setAboutMessage,
        issueAdd
    },
    GraphQLDate
};

function issueList() {
    return issuesDB;
}

function setAboutMessage(_, { message }) {
    return aboutMessage = message;
}

function issueAdd(_, { issue }) {
    issueValidate(issue);
    issue.id = issuesDB.length + 1;
    issue.created = new Date();
    issuesDB.push(issue);

    return issue;
}

function issueValidate(issue) {
    const errors = [];
    if(issue.title.length < 3) {
        errors.push("Field 'title' must be at least 3 characters long");
    }
    if(issue.status === "Assigned" && !issue.owner) {
        errors.push("Field 'owner' is required when status is 'Assigned'");
    }
    if(errors.length > 0) {
        throw new UserInputError("Invalid input(s)", { errors });
    }
}

const server = new ApolloServer({
    typeDefs: fs.readFileSync("./server/schema.graphql", "utf-8"),
    resolvers,
    formatError: error => {
        console.log(error);
        return error;
    }
});

const app = express();

app.use(express.static("public"));

server.applyMiddleware({ app, path: "/graphql" });

app.listen(3000, () =>
    console.log("App started on port 3000")
);
