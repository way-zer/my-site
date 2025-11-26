// Define types for props and data structures
export interface Author {
  login: string;
  avatarUrl: string;
}

export interface Comment {
  author: Author;
  createdAt: string;
  updatedAt: string;
  bodyHTML: string;
}

export interface PostData {
  title: string;
  updatedAt: string;
  bodyHTML: string;
  comments: {
    nodes: Comment[];
  };
  viewerCanReact: boolean;
  url: string;
}

export interface GraphQLResponse {
  repository: {
    issue: {
      title: string;
      updatedAt: string;
      bodyHTML: string;
      viewerCanReact: boolean;
      url: string;
      comments: {
        nodes: Array<{
          author: {
            login: string;
            avatarUrl: string;
          } | null;
          createdAt: string;
          updatedAt: string;
          bodyHTML: string;
        }>;
      };
    };
  };
}

export interface IssuesResponse {
  repository: {
    issues: {
      nodes: Array<{
        number: number;
        title: string;
        createdAt: string;
        labels: {
          nodes: Array<{
            name: string;
            color: string;
            description: string;
          }>;
        };
      }>;
    };
  };
}

export interface UserResponse {
  user: {
    name: string;
    avatarUrl: string;
    url: string;
    websiteUrl: string;
    bio: string;
  };
}

export type CommentNode =
  GraphQLResponse["repository"]["issue"]["comments"]["nodes"][0];