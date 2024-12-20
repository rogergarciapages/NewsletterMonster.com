// Create new file: src/lib/services/follow.ts
import prisma from "@/lib/prisma";

export class FollowService {
  static async checkFollowStatus(followerId: string, targetId: string) {
    try {
      const follow = await prisma.follow.findFirst({
        where: {
          follower_id: followerId,
          brand_id: targetId,
        },
      });
      return !!follow;
    } catch (error) {
      console.error("Error checking follow status:", error);
      throw new Error("Failed to check follow status");
    }
  }

  static async getFollowerCount(targetId: string) {
    try {
      const count = await prisma.follow.count({
        where: {
          brand_id: targetId,
        },
      });
      return count;
    } catch (error) {
      console.error("Error getting follower count:", error);
      throw new Error("Failed to get follower count");
    }
  }

  static async followUser(followerId: string, targetId: string) {
    try {
      const follow = await prisma.follow.create({
        data: {
          follower_id: followerId,
          brand_id: targetId,
        },
      });
      return follow;
    } catch (error) {
      console.error("Error following user:", error);
      throw new Error("Failed to follow user");
    }
  }

  static async unfollowUser(followerId: string, targetId: string) {
    try {
      const result = await prisma.follow.deleteMany({
        where: {
          follower_id: followerId,
          brand_id: targetId,
        },
      });
      return result.count > 0;
    } catch (error) {
      console.error("Error unfollowing user:", error);
      throw new Error("Failed to unfollow user");
    }
  }
}
