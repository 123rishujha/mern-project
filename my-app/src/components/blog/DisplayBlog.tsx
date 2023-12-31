import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IBlog, RootStore, IUser, IComment } from "../../utils/TypeScript";
import Input from "../comments/Input";
import Comments from "../comments/Comments";
import { createComment, getComments } from "../../redux/actions/commentAction";
import Loading from "../global/Loading";

interface IProps {
  blog: IBlog;
}

const DisplayBlog: React.FC<IProps> = ({ blog }) => {
  const { auth, comments } = useSelector((state: RootStore) => state);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showComments, setShowComments] = useState<IComment[]>([]);

  const handleComment = (body: string) => {
    if (!auth.user || !auth.access_token) return;
    const data = {
      content: body,
      user: auth.user,
      blog_id: blog._id as string,
      blog_user_id: (blog.user as IUser)._id,
      createdAt: new Date().toISOString(),
    };
    setShowComments([data, ...showComments]);
    dispatch(createComment(data, auth.access_token));
  };

  useEffect(() => {
    setShowComments(comments?.data || []);
  }, [comments.data]);

  const fetchComments = useCallback(
    async (id: string) => {
      setLoading(true);
      await dispatch(getComments(id));
      setLoading(false);
    },
    [dispatch],
  );

  useEffect(() => {
    if (!blog._id) return;
    fetchComments(blog._id);
  }, [blog._id, fetchComments]);

  return (
    <div>
      <h2
        className="text-center my-3 text-capitalize fs-1"
        style={{ color: "#ff7a00" }}
      >
        {blog.title}
      </h2>

      <div className="text-end fst-italic" style={{ color: "teal" }}>
        <small>
          {typeof blog.user !== "string" && `By: ${blog.user.name}`}
        </small>

        <small className="ms-2">
          {new Date(blog.createdAt).toLocaleString()}
        </small>
      </div>

      <div
        dangerouslySetInnerHTML={{
          __html: blog.content,
        }}
      />
      <hr className="my-1" />
      <h3 style={{ color: "#ff7a00" }}>✩ Comments ✩</h3>

      {auth.user ? (
        <Input callback={handleComment} />
      ) : (
        <h5>
          Please <Link to={`/login?blog/${blog._id}`}>login</Link> to comment.
        </h5>
      )}

      {loading ? (
        <Loading />
      ) : (
        showComments?.map((comment, index) => (
          <Comments key={index} comment={comment} />
        ))
      )}
    </div>
  );
};

export default DisplayBlog;
