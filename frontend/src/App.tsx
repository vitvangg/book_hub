import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loading from "./components/common/Loading";
import MainLayout from "./pages/protected/MainLayout";
import Error from "./pages/Error";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedLayout from "./pages/protected/ProtectedLayout";
import Content from "./components/home/Content";
import SearchContent from "./components/search/SearchContent";
import TopicContent from "./components/topic/TopicContent";
import PostPage from "./components/post/PostPage";
import ProfileLayout from "./components/profile/ProfileLayout";
import CreatePost from "./components/modals/CreatePost";
import EditProfile from "./components/profile/EditProfile";
import UpdatePost from "./components/post/UpdatePost";
import { ToastContainer } from "react-toastify";



function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<Register />} />

        {/* Protected routes */}
        <Route element={<ProtectedLayout />}>
          <Route
            path="/home"
            element={
              <MainLayout>
                <Content />
              </MainLayout>
            }
          />
          <Route
            path="/search"
            element={
              <MainLayout>
                <SearchContent />
              </MainLayout>
            }
          />
          <Route
            path="/topic/:topicName"
            element={
              <MainLayout>
                <TopicContent />
              </MainLayout>
            }
          />
          <Route
            path="/post/:postID"
            element={
              <MainLayout>
                <PostPage />
              </MainLayout>
            }
          />
          <Route
            path="/user/:userID"
            element={
              <MainLayout>
                <ProfileLayout />
              </MainLayout>
            }
          />
          <Route
            path="/create/:postID?"
            element={
              <MainLayout>
                <CreatePost />
              </MainLayout>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <MainLayout>
                <EditProfile />
              </MainLayout>
            }
          />
          <Route
            path="/post/:postID/edit"
            element={
              <MainLayout>
                <UpdatePost />
              </MainLayout>
            }
          />
          <Route path="/loading" element={<Loading />} />
          <Route path="/*" element={<Error />} />
        </Route>
      </Routes>
            {/* Container đặt ở cuối cùng */}
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}
export default App;
