import type {
  CommentNode,
  GraphQLResponse,
  IssuesResponse,
  PostData,
  UserResponse,
} from "./types.ts";

import { graphql } from "@octokit/graphql";
// Configuration
export const CONFIG = {
  owner: "way-zer",
  repo: "way-zer.github.com",
  username: "way-zer",
} as const;

const token = Deno.env.get("GITHUB_TOKEN");

//获取 issues 列表的函数
// 新增：获取 issues 列表的函数
export async function fetchIssues() {
  const gql = graphql.defaults({
    headers: {
      authorization: `bearer ${token}`,
    },
  });
  const response: IssuesResponse = await gql(
    `
    query ($owner: String!, $name: String!) {
      repository(owner: $owner, name: $name) {
        issues(first: 100, states: OPEN, orderBy: {field: CREATED_AT, direction: DESC}) {
          nodes {
            number
            title
            createdAt
            labels(first: 10) {
              nodes {
                name
                color
                description
              }
            }
          }
        }
      }
    }
  `,
    {
      owner: CONFIG.owner,
      name: CONFIG.repo,
    },
  );

  return response.repository.issues.nodes;
}

// 新增：获取用户信息的函数
export async function fetchUserInfo() {
  const gql = graphql.defaults({
    headers: {
      authorization: `bearer ${token}`,
    },
  });
  const response: UserResponse = await gql(
    `
    query ($login: String!) {
      user(login: $login) {
        name
        avatarUrl
        url
        websiteUrl
        bio
      }
    }
  `,
    {
      login: CONFIG.username,
    },
  );

  return response.user;
}
export async function fetchIssue(
  issueNumber: number,
): Promise<PostData> {
  const gql = graphql.defaults({
    headers: {
      authorization: `bearer ${token}`,
    },
  });
  const response: GraphQLResponse = await gql(
    `
    query ($owner: String!, $name: String!, $number: Int!) {
      repository(owner: $owner, name: $name) {
        issue(number: $number) {
          title
          updatedAt
          bodyHTML
          viewerCanReact
          url
          comments(first: 100) {
            nodes {
              author {
                login
                avatarUrl
              }
              createdAt
              updatedAt
              bodyHTML
            }
          }
        }
      }
    }
  `,
    {
      owner: CONFIG.owner,
      name: CONFIG.repo,
      number: issueNumber,
    },
  );

  const issue = response.repository?.issue;
  if (!issue) {
    throw new Error("Issue not found");
  }

  return {
    title: issue.title,
    updatedAt: issue.updatedAt,
    bodyHTML: issue.bodyHTML,
    viewerCanReact: !!issue.viewerCanReact,
    url: issue.url,
    comments: {
      nodes: (issue.comments?.nodes || []).map((c: CommentNode) => ({
        author: c.author
          ? {
            login: c.author.login,
            avatarUrl: c.author.avatarUrl,
          }
          : {
            login: "unknown",
            avatarUrl: "",
          },
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        bodyHTML: c.bodyHTML,
      })),
    },
  };
}
