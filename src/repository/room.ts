import { ResponseDataWithTotal } from "../interfaces";
import { ListRoom } from "../interfaces/room";
import room from "../models/room";

export default new (class RoomRepository {
  public async getUserRoom(
    userId: string,
    skip = 0,
    limit = 15
  ): Promise<ResponseDataWithTotal<ListRoom>[]> {
    try {
      return await room.aggregate<ResponseDataWithTotal<ListRoom>>([
        {
          $match: {
            users: {
              $elemMatch: {
                userId,
              },
            },
          },
        },
        {
          $facet: {
            data: [
              {
                $skip: skip,
              },
              {
                $limit: limit,
              },
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
            total: [
              {
                $count: "total",
              },
            ],
          },
        },
        {
          $unwind: "$total",
        },
        {
          $project: {
            data: 1,
            total: "$total.total",
          },
        },
      ])
    } catch (err) {
      return [
        {
          data: [],
          total: 0,
        },
      ];
    }
  }
})();
