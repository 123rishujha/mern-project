import mongoose from "mongoose"
import { Request, Response } from "express";
import Comments from "../models/commentModel";
import { IReqAuth } from "../config/interface";

const Pagination = (req: IReqAuth) => {
  let page = Number(req.query.page) * 1 || 1;
  let limit = Number(req.query.limit) * 1 || 4;
  let skip = (page - 1) * limit;

  return { page, limit, skip };
};

const commentCtrl = {
  createComment: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(400).json({ msg: "Invalid Authentication" });
    try {
      const { content, blog_id, blog_user_id } = req.body;
      const newComment = new Comments({
        user: req.user._id,
        content,
        blog_id,
        blog_user_id,
      });
      await newComment.save();
      return res.json(newComment);
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getComments: async (req: Request, res: Response) => {
    const { limit, skip } = Pagination(req)
    try {
      const data = await Comments.aggregate([
        {
          $facet: {
            totalData:[
              { $match: {
                blog_id: mongoose.Types.ObjectId(req.params.id),
                comment_root: { $exists: false },
                reply_user: { $exists: false }
              }},
              {
                $lookup: {
                  "from": "users",
                  "localField": "user",
                  "foreignField": "_id",
                  "as": "user"
                }
              },
              { $unwind: "$user" },
              {
                $lookup: {
                  "from": "comments",
                  "let": { cm_id: "$replyCM" },
                  "pipeline": [
                    { $match: { $expr: { $in: ["$_id", "$$cm_id"] } } },
                    {
                      $lookup: {
                        "from": "users",
                        "localField": "user",
                        "foreignField": "_id",
                        "as": "user"
                      }
                    },
                    { $unwind: "$user" },
                    {
                      $lookup: {
                        "from": "users",
                        "localField": "reply_user",
                        "foreignField": "_id",
                        "as": "reply_user"
                      }
                    },
                    { $unwind: "$reply_user" }
                  ],
                  "as": "replyCM"
                }
              },
              { $sort: { createdAt: -1 } },
              { $skip: skip },
              { $limit: limit }
            ],
            totalCount: [
              { $match: {
                blog_id: mongoose.Types.ObjectId(req.params.id),
                comment_root: { $exists: false },
                reply_user: { $exists: false }
              }},
              { $count: 'count' }
            ]
          }
        },
        {
          $project: {
            count: { $arrayElemAt: ["$totalCount.count", 0] },
            totalData: 1
          }
        }
      ])
      const comments = data[0].totalData;
      const count = data[0].count;
      let total = 0;
      if(count % limit === 0){
        total = count / limit;
      }else{
        total = Math.floor(count / limit) + 1;
      }
      return res.json({ comments, total })
    } catch (err: any) {
      return res.status(500).json({msg: err.message})
    }
  },
  replyComment: async (req: IReqAuth, res: Response) => {
    if(!req.user)
      return res.status(400).json({msg: "invalid Authentication."})

    try {
      const { 
        content,
        blog_id,
        blog_user_id,
        comment_root,
        reply_user
      } = req.body


      const newComment = new Comments({ 
        user: req.user._id,
        content,
        blog_id,
        blog_user_id,
        comment_root,
        reply_user: reply_user._id
      })

      await Comments.findOneAndUpdate({_id: comment_root}, {
        $push: { replyCM: newComment._id }
      })

      await newComment.save()

      return res.json(newComment)

    } catch (err: any) {
      return res.status(500).json({msg: err.message})
    }
  }
};

export default commentCtrl;
