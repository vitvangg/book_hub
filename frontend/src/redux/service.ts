import { createApi, fetchBaseQuery, setupListeners} from "@reduxjs/toolkit/query/react";
import {  addMyInfo, setUserInfo, addTag, addListComments } from "./slice";
import type { CreateDraftResponse } from "../config/constants.ts";

export const serviceApi = createApi({
    reducerPath: "serviceApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api", 
        credentials: "include" // Gửi kèm cookie 
    }),
    keepUnusedDataFor: 60 * 60 * 24, // Lưu cache trong 24 giờ
    tagTypes: ['User', 'Post', 'Me', 'Block', 'Tag', 'Comment'], // Định nghĩa các loại tag
    endpoints: (builder) => ({
        signup: builder.mutation({
            query: (data) => ({
                url: "/sign-up",
                method: "POST",
                body: data
            }),
            invalidatesTags: ['Me'],
        }),
        login: builder.mutation({
            query: (data) => ({
                url: "/log-in",
                method: "POST",
                body: data
            }),
            invalidatesTags: ['Me'],
        }),
        
        // Lấy thông tin người dùng hiện tại
        getMyInfo: builder.query<any, void>({
            query: () => ({
                url: "/me",
                method: "GET",
            }),
            providesTags: ['Me'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } =  await queryFulfilled;
                    dispatch(addMyInfo(data));
                } catch (error) {
                    console.error("Failed to fetch user info:", error);
                }
            },
        }),
        // Update thông tin người dùng hiện tại
        updateMyInfo: builder.mutation({
            query: (data) => ({
                url: "/update-profile",
                method: "PUT",
                body: data
            }),
            invalidatesTags: ['Me'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } =  await queryFulfilled;
                    dispatch(addMyInfo(data));
                } catch (error) {
                    console.error("Failed to update user info:", error);
                }
            },
        }),
        logout: builder.mutation({
            query: () => ({
                url: "/log-out",
                method: "POST",
            }),
            invalidatesTags: ['Me'],
        }),
        getUserDetail: builder.query<any, string>({
            query: (userId) => ({
                url: `/user/${userId}`,
                method: "GET",
            }),
            providesTags: ((result, error, userId) => [{ type: 'User', id: userId }]),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } =  await queryFulfilled;
                    dispatch(setUserInfo(data));
                } catch (error) {
                    console.error("Failed to fetch user info:", error);
                }
            },
        }),
        listPostByUser: builder.query<any, { userID: number, page: number }>({
            query: ({ userID, page }) => ({
                url: `/list-posts-by-user/${userID}?page=${page}`,
                method: "GET",
            }),
            providesTags: (result, error, args) => {
                return result?.posts
                    ? [
                        ...result.posts.map(({ post_id }: { post_id: number }) => ({ type: 'Post' as const, id: post_id })),
                        { type: 'Post', id: "LIST" },
                    ]
                    : [{ type: 'Post', id: "LIST" }];
            },
        }),
        listTag: builder.query<any, void>({
            query: () => ({
                url: `list-tags`,
                method: "GET",
            }),
            providesTags: (result) =>
                result?.tags
                ? [
                    ...result.tags.map(({ tag_id }: { tag_id: number }) => ({
                        type: 'Tag' as const,
                        id: tag_id,
                    })),
                    { type: 'Tag', id: "LIST" },
                    ]
                : [{ type: 'Tag', id: "LIST" }],
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(addTag(data));
                } catch (error) {
                    console.error("Fetch tags failed", error);
                }
            },
        }),

        // Tạo post mới
        // 1. Khởi tạo post
        createDraftPost: builder.mutation<CreateDraftResponse, void>({
            query: () => ({
                url: "/creating-post",
                method: "POST",
            }),
        }),
        // 2. Tạo Block
        createBlock: builder.mutation({
            query: (data) => ({
                url: "/create-block",
                method: "POST",
                body: data
            }),
            invalidatesTags: ['Block'],
        }),

        // 3. Xoá Block
        deleteBlock: builder.mutation({
            query: (blockID) => ({
                url: `/delete-block/${blockID}`,
                method: "DELETE",
            }),
            invalidatesTags: ['Block'],
        }),

        // 3.5 Update Block
        updateBlock: builder.mutation({
            query: ({ blockID, formData, postID }) => ({
                url: `/update-block/${blockID}`,
                method: "PUT",
                body: formData
            }),
            invalidatesTags: (result, error, { postID }) => [
                { type: "Block", id: `POST_${postID}` },
                { type: "Post", id: "LIST" },
                { type: "Post", id: postID }
            ]
        }),

        // 3.6 Delete list Block by PostID
        deleteListBlockByPost: builder.mutation({
            query: (postID) => ({
                url: `/delete-list-block/${postID}`,
                method: "DELETE",
            }),
            invalidatesTags: ['Block'],
        }),

        // 4. Xuất bản Post
        publishPost: builder.mutation({
            query: ({ postID, title, quote, tagIDs }) => ({
                url: `/created-post/${postID}`,
                method: "PATCH",
                body: { title, quote, tagIDs }
            }),
            invalidatesTags: (result, error, {postID}) => [{ type: 'Post', id: postID }],
        }),
        listBlockByPost: builder.query<any, string>({
            query: (postID) => ({
                url: `/list-block/${postID}`,
                method: "GET",
            }),
            providesTags: (result, error, postID) =>
                result?.blocks
                ? [
                    ...result.blocks.map(({ block_id }: { block_id: number }) => ({
                        type: 'Block' as const,
                        id: block_id,
                    })),
                    { type: 'Block', id: `POST_${postID}` },
                    ]
                : [{ type: 'Block', id: `POST_${postID}` }],
        }),
        // 5. Xoá Post
        deletePost: builder.mutation({
            query: (postID) => ({
                url: `/delete-post/${postID}`,
                method: "DELETE",
            }),
            invalidatesTags: ['Post'],
        }),
        
        // 6. Get Post Detail
        getPostDetail: builder.query<any, string>({
            query: (postID) => ({
                url: `/post/${postID}`,
                method: "GET",
            }),
            providesTags: (result, error, postID) => [{ type: 'Post', id: postID }],
        }),

        // 7. Update Post Detail
        updatePostDetail: builder.mutation({
            query: ({ postID, title, quote, tagIDs }) => ({
                url: `/update-post/${postID}`,
                method: "PUT",
                body: { title, quote, tagIDs }
            }),
            invalidatesTags: (result, error, {postID}) => [{ type: 'Post', id: postID }],
        }),

        // 7. List Comments by PostID
        listCommentsByPost: builder.query<any, { postID: string, skip?: number, limit?: number, replyLimit?: number }>({
            query: ({ postID, skip, limit, replyLimit }) => ({
                url: `/list-comments/${postID}?skip=${skip}&limit=${limit}&replyLimit=${replyLimit}`,
                method: "GET"
            }),
            providesTags: (result, error, args) => {
                return result
                    ? [
                        ...result.map(({ comment_id }: { comment_id: number }) => ({ type: 'Comment' as const, id: comment_id })),
                        { type: 'Comment', id: "LIST" },
                    ]
                    : [{ type: 'Comment', id: "LIST" }];
            },
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } =  await queryFulfilled;
                    dispatch(addListComments(data));
                } catch (error) {
                    console.error("Failed to fetch comments info:", error);
                }
            },
        }),
        createComment: builder.mutation({
            query: ({postID, content}) => ({
                url: `/create-comment`,
                method: "POST",
                body: { postID, content }
            }),
            invalidatesTags: ['Comment'],
        }),
        updateComment: builder.mutation({
            query: ({commentID, content}) => ({
                url: `/update-comment/${commentID}`,
                method: "PUT",
                body: { content }
            }),
            invalidatesTags: ['Comment'],
        }),
        deleteComment: builder.mutation({
            query: (commentID) => ({
                url: `/delete-comment/${commentID}`,
                method: "DELETE",
            }),
            invalidatesTags: ['Comment'],
        }),
        replyComment: builder.mutation({
            query: ({postID, content, commentID}) => ({
                url: `/reply-comment/${commentID}`,
                method: "POST",
                body: { postID, content }
            }),
            invalidatesTags: ['Comment'],
        }),

        // Follow - Unfollow
        checkFollow: builder.query<any, number>({
            query: (userID) => ({
                url: `/check-follow/${userID}`,
                method: "GET",
            }),
            providesTags: (result, error, userID) => [{ type: 'User', id: userID }],
        }),
        followUser: builder.mutation({
            query: (userID) => ({
                url: `/follow/${userID}`,
                method: "POST",
            }),
            invalidatesTags: (result, error, userID) => [{ type: "User", id: userID }, "Me"],
        }),

        // Like - Unlike Post
        likePost: builder.mutation({
            query: (postID) => ({
                url: `/like-post/${postID}`,
                method: "POST",
            }),
            invalidatesTags: (result, error, postID) => [{ type: "Post", id: postID }, "Me"],
        }),

        // Homepage list posts
        // List latest posts
        listLatestPosts: builder.query<any, { page: number }>({
            query: ({ page }) => ({
                url: `/latest-posts?page=${page}`,
                method: "GET",
            }),
            providesTags: (result, error, args) => {
                return result?.posts
                    ? [
                        ...result.posts.map(({ post_id }: { post_id: number }) => ({ type: 'Post' as const, id: post_id })),
                        { type: 'Post', id: "LIST" },
                    ]
                    : [{ type: 'Post', id: "LIST" }];
            },
        }),

        // List rated posts
        listRatedPosts: builder.query<any, { page: number }>({
            query: ({ page }) => ({
                url: `/top-rated-posts?page=${page}`,
                method: "GET",
            }),
            providesTags: (result, error, args) => {
                return result?.posts
                    ? [
                        ...result.posts.map(({ post_id }: { post_id: number }) => ({ type: 'Post' as const, id: post_id })),
                        { type: 'Post', id: "LIST" },
                    ]
                    : [{ type: 'Post', id: "LIST" }];
            },
        }),

        // List Post by Following Users
        listPostByFollowingUsers: builder.query<any, { page: number }>({
            query: ({ page }) => ({
                url: `/following-posts?page=${page}`,
                method: "GET",
            }),
            providesTags: (result, error, args) => {
                return result?.posts
                    ? [
                        ...result.posts.map(({ post_id }: { post_id: number }) => ({ type: 'Post' as const, id: post_id })),
                        { type: 'Post', id: "LIST" },
                    ]
                    : [{ type: 'Post', id: "LIST" }];
            },
        }),

        // List Post Hot
        listHotPosts: builder.query<any, { page: number }>({
            query: ({ page }) => ({
                url: `/hot-posts?page=${page}`,
                method: "GET",
            }),
            providesTags: (result, error, args) => {
                return result?.posts
                    ? [
                        ...result.posts.map(({ post_id }: { post_id: number }) => ({ type: 'Post' as const, id: post_id })),
                        { type: 'Post', id: "LIST" },
                    ]
                    : [{ type: 'Post', id: "LIST" }];
            },
        }),
        listTrending30: builder.query<any, void>({
            query: () => ({
                url: `/trending-30days`,
                method: "GET",
            }),
            providesTags: (result, error, args) => {
                return result?.posts
                    ? [
                        ...result.posts.map(({ post_id }: { post_id: number }) => ({ type: 'Post' as const, id: post_id })),
                        { type: 'Post', id: "LIST" },
                    ]
                    : [{ type: 'Post', id: "LIST" }];
            },
        }),

        // filter by tag
        listLatestPostsByTag: builder.query<any, { page: number, tagId: number }>({
            query: ({ page, tagId }) => ({
                url: `/latest-posts-by-tag/${tagId}?page=${page}`,
                method: "GET",
            }),
            providesTags: (result, error, args) => {
                return result?.posts
                    ? [
                        ...result.posts.map(({ post_id }: { post_id: number }) => ({ type: 'Post' as const, id: post_id })),
                        { type: 'Post', id: "LIST" },
                    ]
                    : [{ type: 'Post', id: "LIST" }];
            },
        }),
        listHotPostsByTag: builder.query<any, { page: number, tagId: number }>({
            query: ({ page, tagId }) => ({
                url: `/hot-posts-by-tag/${tagId}?page=${page}`,
                method: "GET",
            }),
            providesTags: (result, error, args) => {
                return result?.posts
                    ? [
                        ...result.posts.map(({ post_id }: { post_id: number }) => ({ type: 'Post' as const, id: post_id })),
                        { type: 'Post', id: "LIST" },
                    ]
                    : [{ type: 'Post', id: "LIST" }];
            },
        }),
        listTopRatedPostsByTag: builder.query<any, { page: number, tagId: number }>({
            query: ({ page, tagId }) => ({
                url: `/top-rated-posts-by-tag/${tagId}?page=${page}`,
                method: "GET",
            }),
            providesTags: (result, error, args) => {
                return result?.posts
                    ? [
                        ...result.posts.map(({ post_id }: { post_id: number }) => ({ type: 'Post' as const, id: post_id })),
                        { type: 'Post', id: "LIST" },
                    ]
                    : [{ type: 'Post', id: "LIST" }];
            },
        }),
        listPostBySearch: builder.query<any, { page: number, searchTerm: string }>({
            query: ({ page, searchTerm }) => ({
                url: `/search-posts?q=${searchTerm}&page=${page}`,
                method: "GET",
            }),
            providesTags: (result, error, args) => {
                return result?.posts
                    ? [
                        ...result.posts.map(({ post_id }: { post_id: number }) => ({ type: 'Post' as const, id: post_id })),
                        { type: 'Post', id: "LIST" },
                    ]
                    : [{ type: 'Post', id: "LIST" }];
            },
        }),
        listUserBySearch: builder.query<any, { page: number, searchTerm: string }>({
            query: ({ page, searchTerm }) => ({
                url: `/search-users?q=${searchTerm}&page=${page}`,
                method: "GET",
            }),
            providesTags: (result, error, args) => {
                return result?.data
                    ? [
                        ...result.data.map(({ user_id }: { user_id: number }) => ({ type: 'User' as const, user_id })),
                        { type: 'User', id: "LIST" },
                    ]
                    : [{ type: 'User', id: "LIST" }];
            },
        }),
    }),
});
export const { useSignupMutation, useLoginMutation, useGetMyInfoQuery, useLogoutMutation, useGetUserDetailQuery, 
    useListPostByUserQuery, useCreateDraftPostMutation,
    useDeletePostMutation,
    useCreateBlockMutation, useDeleteBlockMutation,
    usePublishPostMutation,
    useUpdateBlockMutation,
    useListBlockByPostQuery,
    useDeleteListBlockByPostMutation,
    useListTagQuery,
    useUpdateMyInfoMutation,
    useGetPostDetailQuery,
    useListCommentsByPostQuery, useCreateCommentMutation,
    useUpdateCommentMutation,
    useDeleteCommentMutation,
    useReplyCommentMutation,
    useFollowUserMutation,
    useCheckFollowQuery,
    useUpdatePostDetailMutation,
    useLikePostMutation,
    useListLatestPostsQuery,
    useListRatedPostsQuery,
    useListPostByFollowingUsersQuery,
    useListHotPostsQuery,
    useListTrending30Query,
    useListTopRatedPostsByTagQuery,
    useListLatestPostsByTagQuery,
    useListHotPostsByTagQuery,
    useListPostBySearchQuery,
    useListUserBySearchQuery
 } = serviceApi;