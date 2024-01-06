import { ResponseDataWithTotal } from "../interfaces";
import { ListRoom } from "../interfaces/room";
import room from "../models/room";

export default new (class RoomRepository {
  public async getUserRoom(
    userId: string,
    $skip = 0,
    $limit = 15
  ): Promise<(ResponseDataWithTotal<ListRoom> & { type: string })[]> {
    try {
      return await room.aggregate<
        ResponseDataWithTotal<ListRoom> & { type: string }
      >([
        {
          $match: {
            users: {
              $elemMatch: { userId },
            },
          },
        },
        {
          $facet: {
            data: [
              { $skip },
              { $limit },
              {
                $project: {
                  type: 1,
                  users: {
                    $slice: ["$users.userId", 0, 5],
                  },
                  image: 1,
                  name: 1,
                  chats: {
                    $slice: ["$chats", 0, 15],
                  },
                },
              },
            ],
            total: [{ $count: "total" }],
          },
        },
        { $unwind: "$total" },
        { $unwind: "$data" },
        {
          $group: {
            _id: "$data.type",
            data: {
              $push: "$$ROOT.data",
            },
            total: {
              $first: "$total.total",
            },
          },
        },
      ]);
    } catch (err) {
      return [
        {
          type: "",
          data: [],
          total: 0,
        },
      ];
    }
  }
})();
