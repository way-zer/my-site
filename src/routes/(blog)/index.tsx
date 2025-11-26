import { fetchIssues, fetchUserInfo } from "./(_assets)/service.ts";
import { define } from "../../utils/state.ts";

export default define.page(async function (ctx) {
  const url = new URL(ctx.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
  const perPage = 10;

  const [allIssues, userInfo] = await Promise.all([
    fetchIssues(),
    fetchUserInfo(),
  ]);

  // 分页逻辑
  const totalPages = Math.ceil(allIssues.length / perPage);
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const issues = allIssues.slice(startIndex, endIndex);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  return (
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-4xl mx-auto px-6 py-12">
        {/* User Info Section */}
        <div id="user" class="text-center mb-16">
          <img
            src={userInfo.avatarUrl}
            alt={userInfo.name}
            class="w-24 h-24 rounded-full mx-auto mb-6"
          />
          <h1 class="text-3xl font-light text-gray-900 mb-4">{userInfo.name}</h1>
          <div id="social" class="mb-8">
            <a
              target="_blank"
              href={userInfo.url}
              class="inline-block text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6"
                viewBox="0 0 1025 1024"
              >
                <path
                  fill="currentColor"
                  d="M62 551c0 41 4 78 12 111s18 61 31 86c14 24 31 46 52 64a314 314 0 0 0 151 74c31 7 63 12 96 15a1207 1207 0 0 0 311-15c31-7 59-17 84-29s47-26 68-45c21-18 38-40 52-64s24-53 32-86c7-33 11-70 11-111 0-73-24-136-73-189l7-24 6-38c2-17 2-36-2-57s-9-44-18-67l-7-1h-23a239 239 0 0 0-93 31c-22 12-46 26-71 43-43-12-101-18-176-18s-133 6-176 18a608 608 0 0 0-126-66 209 209 0 0 0-60-8l-7 1c-10 23-16 45-19 67a234 234 0 0 0 11 119c-49 53-73 116-73 189zm111 110c0-42 19-80 57-116 12-10 25-18 40-24s33-8 52-9 38-1 55 1l65 4a995 995 0 0 0 199-4c18-2 36-2 56-1 19 1 36 4 51 9s29 14 40 24c39 35 58 74 58 116 0 26-3 48-10 68s-14 35-24 49c-10 13-23 24-41 33s-34 17-51 22c-16 5-38 9-64 11l-69 5a2784 2784 0 0 1-225-5 284 284 0 0 1-115-33c-17-9-31-20-41-33-10-14-18-30-24-49s-9-42-9-68zm452-8c0-47 25-85 56-85s56 38 56 85c0 46-25 84-56 84s-56-38-56-84zm-338 0c0-47 25-85 56-85s57 38 57 85c0 46-26 84-57 84s-56-38-56-84z"
                />
              </svg>
            </a>
          </div>
          <hr class="w-12 mx-auto border-gray-300" />
        </div>

        {/* Posts List */}
        <div id="posts" class="space-y-6">
          {issues.map((issue) => (
            <a
              key={issue.number}
              href={`/blog/${issue.number}`}
              class="block bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h2 class="text-xl font-medium text-gray-900 mb-2">
                    {issue.title}
                  </h2>
                  <p class="text-gray-500 text-sm mb-3">
                    {new Date(issue.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <div class="flex flex-wrap gap-2">
                    {issue.labels.nodes.map((label) => (
                      <span
                        key={label.name}
                        class="inline-block px-2 py-1 text-xs font-medium rounded-full"
                        style={{
                          backgroundColor: `#${label.color}`,
                          color: "#fff",
                        }}
                        title={label.description}
                      >
                        {label.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Pagination */}
        <div class="mt-12 flex justify-center space-x-4">
          {hasPrevPage && (
            <a
              href={`?page=${currentPage - 1}`}
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            >
              Previous
            </a>
          )}
          <span class="px-4 py-2 bg-gray-100 text-gray-600 rounded">
            Page {currentPage} of {totalPages}
          </span>
          {hasNextPage && (
            <a
              href={`?page=${currentPage + 1}`}
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            >
              Next
            </a>
          )}
        </div>

        {/* Footer */}
        <div id="footer" class="text-center mt-16 pt-8 border-t border-gray-200">
          <p class="text-gray-500 text-sm">
            © {new Date().getFullYear()}{" "}
            <a
              href={userInfo.url}
              class="text-gray-600 hover:text-gray-900 transition-colors"
            >
              {userInfo.name}
            </a>
            's blog.
          </p>
        </div>
      </div>
    </div>
  );
});