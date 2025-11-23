export const topics = [
"quan điểm - tranh luận",
"khoa học - công nghệ",
"tài chính",
"nhiếp ảnh",
"thinking out loud",
"giáo dục",
"game",
"phát triển bản thân",
"other"
];

export type CreateDraftResponse = {
  message: string;
  post: {
    post_id: number;
    user_id: number;
    status: string;
  };
};
