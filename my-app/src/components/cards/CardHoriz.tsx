import React from "react";
import { Link } from "react-router-dom";

import { IBlog } from "../../utils/TypeScript";

interface IProps {
  blog: IBlog;
}

const CardHoriz: React.FC<IProps> = ({ blog }) => {
  return (
    <div className="card mb-3" style={{ minWidth: "280px" }}>
      <div className="row g-0 p-2">
        <div
          className="col-md-4"
          style={{ minHeight: "150px", maxHeight: "170px", overflow: "hidden" }}
        >
          {blog?.thumbnail && (
            <>
              {typeof blog.thumbnail === "string" ? (
                <Link to={`/blog/${blog._id}`}>
                  <img
                    className="w-100 h-100"
                    style={{ objectFit: "cover", objectPosition: "center" }}
                    alt="thumbnail"
                    src={blog?.thumbnail}
                  />
                </Link>
              ) : (
                <img
                  className="w-100 h-100"
                  src={URL.createObjectURL(blog?.thumbnail)}
                  alt="thumbnail"
                  style={{ objectFit: "cover", objectPosition: "center" }}
                />
              )}
            </>
          )}
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">
              <Link
                to={`/blog/${blog._id}`}
                className="text-capitalize text-decoration-none"
              >
                {blog.title}
              </Link>
            </h5>
            <p className="card-text">{blog.description}</p>
            <p className="card-text">
              <small className="text-muted">
                {new Date(blog.createdAt).toLocaleString()}
              </small>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardHoriz;
