import { Box, Stack, Typography, Avatar, Divider } from "@mui/material";
import { useRef, useState } from "react";
import SideBar from "./SideBar";
import Comment from "./Comment";

export default function PostPage() {
  const [comments, setComments] = useState([]);
  const commentRef = useRef<HTMLDivElement | null>(null);

  // Hàm cuộn xuống phần comment
  const scrollToComment = () => {
    commentRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        borderRadius: 2,
        background: "#121212",
        color: "white",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Khu vực cuộn nội dung */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          py: 5,
          px: 4,
          "&::-webkit-scrollbar": { width: "8px" },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(255,255,255,0.2)",
            borderRadius: "4px",
          },
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          alignItems="flex-start"
        >
          {/* Nội dung chính */}
          <Box sx={{ width: "90%" }}>
            {/* Chủ đề */}
            <Typography
              variant="subtitle1"
              color="gray"
              fontWeight={500}
              mb={1}
            >
              Tài chính
            </Typography>

            {/* Tiêu đề */}
            <Typography
              variant="h3"
              fontWeight={700}
              sx={{ lineHeight: 1.2, mb: 2 }}
            >
              Cách tư duy về rủi ro, cùng Howard Marks
            </Typography>

            {/* Trích dẫn */}
            <Typography
              variant="h6"
              sx={{ fontStyle: "italic", color: "rgba(255,255,255,0.6)" }}
              mb={3}
            >
              “Rủi ro là bài kiểm tra cuối cùng về kỹ năng của một nhà đầu tư.”
            </Typography>

            {/* Thông tin tác giả */}
            <Stack direction="row" alignItems="center" spacing={2} mb={4}>
              <Avatar
                src="https://i.pinimg.com/originals/6e/93/7d/6e937d33ec57a3e65f5a9b9f457f2f39.jpg"
                alt="Author"
                sx={{ width: 56, height: 56 }}
              />
              <Box>
                <Typography fontWeight={600}>Benjamin P. Penner</Typography>
                <Typography color="gray" variant="body2">
                  Hôm qua
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", mb: 4 }} />

            {/* Nội dung bài viết */}
            <Typography variant="h5" fontWeight={600} mb={2}>
              Lời giới thiệu của người dịch
            </Typography>
            <Typography variant="body1" sx={{ color: "#ddd", mb: 2 }}>
              Đây là một bài viết nổi tiếng của Howard Marks — một trong những
              nhà đầu tư có tư duy sâu sắc nhất trong giới tài chính...
            </Typography>
            <Typography variant="body1" sx={{ color: "#ccc", mb: 2 }}>
              Nhà đầu tư cần hiểu rằng, rủi ro không chỉ là con số trong bảng
              tính, mà còn là cảm giác, là sự không chắc chắn...
            </Typography>
            <Typography variant="body1" sx={{ color: "#ccc" }}>
              Khi đọc và hiểu được tư duy của Howard Marks, bạn sẽ nhận ra rằng
              đầu tư không chỉ là kiếm tiền, mà là quản lý sự bất định với tâm
              thế vững vàng và lý trí. Nếu bạn nào chưa biết thì tóm tắt thế
              này, bản tin VTV đó nói rằng Việt Nam sẽ thừa khoảng 1,38 triệu
              nam giới vào năm 2026, cụ thể con số ấy là nam giới loại gì, là
              trai thẳng hay trai cong, ít não hay nhiều não, trong độ tuổi
              trưởng thành hay chưa thì không được nhắc đến cụ thể trong bản
              tin. Nhưng mà các anh chị nhà báo có nhấn mạnh một ý rằng số nam
              giới ấy được so sánh với hàng tồn kho, sẽ có rất ít khả năng hoặc
              không thể lấy được vợ hay có bạn gái. So sánh hơi gắt nhỉ, ôi trời
              ơi, thế thì làm sao tôi thoát được kiếp FA đây, phải làm gì khi tỉ
              lệ cạnh tranh nếu muốn có bạn gái sẽ cao gấp vài chục lần tỉ lệ
              chọi thi đại học năm xưa. Ở cái thời buổi này, chuyện nhờ bà mai
              bà mối hay bố mẹ đặt con trai mình vào đâu làm sao có thể xảy ra
              khi không có con gái, số lượng chị em tồn tại trên cõi đời quá đủ,
              ác mộng, ôi đúng là ác mộng. Nhưng mà nè, cách tốt nhất để thoát
              ra khỏi ác mộng, chắc là nhiều người cũng nghĩ ra mà, làm ơn, tỉnh
              mộng giùm tôi nào. Anh chị em chúng ta cùng ngồi xuống, uống miếng
              nước ăn miếng bánh, bình tâm xem xét những vấn đề hay ho xoay
              quanh con số 1,38 triệu nam giới thừa ra.Khi có nhiều hơn 2 lựa
              chọn, khả năng đưa ra quyết định đúng đắn của con người đã giảm đi
              khá nhiều, vì thế nên dạng bài tập trắc nghiệm là loại bài khi đi
              thi các bạn tưởng là dễ mà đôi khi không hiểu vì sao mình chọn
              sai. Và nếu có nhiều hơn 7 lựa chọn, con người hầu như có rất rất
              ít khả năng đưa ra quyết định không ngoan, đó là một kiến thức tâm
              lý học nho nhỏ mà tôi góp nhặt được từ người thầy YouTube của
              mình. Bạn có thể tự nghĩ lại cảm giác khi đi siêu thị chọn mua sữa
              hay đồ gì đó mà trên kệ hàng có rất nhiều brand khác nhau, trời
              má, đứng nghĩ một thôi một hồi xong cuối cùng vẫn chỉ là chọn đại,
              đa số là vậy đấy. Đương nhiên chị em cũng không cần thiết phải
              chọn đến nhiều hơn 7 thằng con trai trong cùng một thời điểm.
              Nhưng cứ nghĩ mà xem, ở trên giảng đường, ở văn phòng công sở, ở
              sân vận động hay đến các khu vui chơi, đi đâu cũng nhìn thấy toàn
              con trai là con trai thì biết chọn anh nào đây. Hãy cẩn thận và
              trang bị kiến thức cẩn thận, tôi xin đặc biệt nhấn mạnh lại chữ
              cẩn thận một lần nữa vì, cẩn tắc thì vô áy náy, chọn người bạn để
              gửi gắm cả cuộc đời không phải là chuyện dễ dàng đâu nhỉ, còn kiến
              thức chọn lựa thế nào thì xin phép bàn luận ở một bài viết khác.
              Còn nếu bạn là một cô gái không hứng thú với chuyện chọn bạn trai
              và đang đọc bài viết này thì không sao, đừng vội sục sôi với tác
              giả, có thể bây giờ bạn không thích chọn, nhưng sau này đến tầm
              U40, U50, ai mà biết được tương lai sẽ ra sao, nhỉ, con người
              thường hay thề nguyền rằng cả đời sẽ thế này sẽ thế kia và chúng
              ta thường thấy câu nói đó thành hiện thực trên phim ảnh hay mấy
              cuốn sách fiction. Khi có nhiều hơn 2 lựa chọn, khả năng đưa ra
              quyết định đúng đắn của con người đã giảm đi khá nhiều, vì thế nên
              dạng bài tập trắc nghiệm là loại bài khi đi thi các bạn tưởng là
              dễ mà đôi khi không hiểu vì sao mình chọn sai. Và nếu có nhiều hơn
              7 lựa chọn, con người hầu như có rất rất ít khả năng đưa ra quyết
              định không ngoan, đó là một kiến thức tâm lý học nho nhỏ mà tôi
              góp nhặt được từ người thầy YouTube của mình. Bạn có thể tự nghĩ
              lại cảm giác khi đi siêu thị chọn mua sữa hay đồ gì đó mà trên kệ
              hàng có rất nhiều brand khác nhau, trời má, đứng nghĩ một thôi một
              hồi xong cuối cùng vẫn chỉ là chọn đại, đa số là vậy đấy. Đương
              nhiên chị em cũng không cần thiết phải chọn đến nhiều hơn 7 thằng
              con trai trong cùng một thời điểm. Nhưng cứ nghĩ mà xem, ở trên
              giảng đường, ở văn phòng công sở, ở sân vận động hay đến các khu
              vui chơi, đi đâu cũng nhìn thấy toàn con trai là con trai thì biết
              chọn anh nào đây. Hãy cẩn thận và trang bị kiến thức cẩn thận, tôi
              xin đặc biệt nhấn mạnh lại chữ cẩn thận một lần nữa vì, cẩn tắc
              thì vô áy náy, chọn người bạn để gửi gắm cả cuộc đời không phải là
              chuyện dễ dàng đâu nhỉ, còn kiến thức chọn lựa thế nào thì xin
              phép bàn luận ở một bài viết khác. Còn nếu bạn là một cô gái không
              hứng thú với chuyện chọn bạn trai và đang đọc bài viết này thì
              không sao, đừng vội sục sôi với tác giả, có thể bây giờ bạn không
              thích chọn, nhưng sau này đến tầm U40, U50, ai mà biết được tương
              lai sẽ ra sao, nhỉ, con người thường hay thề nguyền rằng cả đời sẽ
              thế này sẽ thế kia và chúng ta thường thấy câu nói đó thành hiện
              thực trên phim ảnh hay mấy cuốn sách fiction.
            </Typography>

            {/* Comment */}
            <Stack
              justifyContent="center"
              alignItems="center"
              mt={4}
              ref={commentRef}
            >
              <Comment />
            </Stack>
          </Box>

          {/* Sidebar */}
          <Box
            sx={{
              width: "10%",
              position: "sticky",
              top: 80,
              height: "fit-content",
              maxHeight: "calc(100vh - 100px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <SideBar onCommentClick={scrollToComment} />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
