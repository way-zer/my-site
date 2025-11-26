import { fetchIssue } from "../(_assets)/service.ts";
import { define } from "../../../utils/state.ts";
import "../(_assets)/github-markdown.css";

// Fresh page component
export default define.page(async function (ctx) {
  const data = await fetchIssue(+ctx.params.id);
  return (
    <div class="min-h-screen bg-gray-50 py-12">
      <div class="max-w-4xl mx-auto px-6">
        {/* Back button */}
        <a
          href=".."
          class="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <span class="icon-[solar--arrow-left-outline] mr-2"></span>
          Back
        </a>

        {/* Article header */}
        <header class="mb-12">
          <h1 class="text-3xl font-light text-gray-900 leading-tight mb-4">
            {data.title}
          </h1>
          <p class="text-gray-500 text-sm">
            Updated {new Date(data.updatedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </header>

        {/* Article content */}
        <article class="bg-white rounded-lg shadow-sm p-8 mb-12">
          <div
            class="markdown-body"
            dangerouslySetInnerHTML={{ __html: data.bodyHTML }}
          />
        </article>

        {/* Comments section */}
        <section>
          <h2 class="text-xl font-light text-gray-900 mb-6">Comments</h2>
          <div class="space-y-6">
            {data.comments.nodes.map((comment, index) => (
              <div key={index} class="bg-white rounded-lg shadow-sm p-6">
                <div class="flex items-start space-x-4">
                  <img
                    class="w-10 h-10 rounded-full"
                    src={comment.author.avatarUrl}
                    alt={comment.author.login}
                  />
                  <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-2">
                      <span class="font-medium text-gray-900">
                        {comment.author.login}
                      </span>
                      <span class="text-gray-500 text-sm">
                        {new Date(comment.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div
                      class="markdown-body"
                      dangerouslySetInnerHTML={{ __html: comment.bodyHTML }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add comment button */}
          {data.viewerCanReact && (
            <div class="mt-8 text-center">
              <a
                href={`${data.url}#new_comment_field`}
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
              >
                Add Comment
              </a>
            </div>
          )}
        </section>
      </div>
    </div>
  );
});
