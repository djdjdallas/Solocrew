"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/components/providers/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { Users, Clock, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/sonner";

export function DealPool({ pool, onJoin }) {
  const [isJoining, setIsJoining] = useState(false);
  const [members, setMembers] = useState(pool.members || []);
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClient();

  const progress = (members.length / pool.minTravelers) * 100;
  const isPoolFull = members.length >= pool.maxTravelers;
  const hasJoined = user
    ? members.some((member) => member.userId === user.id)
    : false;
  const isExpired = new Date(pool.expiresAt) < new Date();

  // Time remaining calculation
  const timeRemaining = () => {
    const now = new Date();
    const expiry = new Date(pool.expiresAt);
    const diffMs = expiry.getTime() - now.getTime();

    if (diffMs <= 0) return "Expired";

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(
      (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    if (diffDays > 0) {
      return `${diffDays}d ${diffHours}h left`;
    } else {
      return `${diffHours}h left`;
    }
  };

  const handleJoinPool = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (isJoining || hasJoined || isPoolFull || isExpired) return;

    setIsJoining(true);

    try {
      const { data, error } = await supabase
        .from("pool_members")
        .insert({
          pool_id: pool.id,
          user_id: user.id,
          status: "pending",
        })
        .select("*, user:users(id, first_name, last_name, avatar_url)")
        .single();

      if (error) throw error;

      setMembers([...members, data]);
      toast({
        title: "Successfully joined pool!",
        description:
          "You'll be notified when the minimum group size is reached.",
      });

      if (onJoin) onJoin();
    } catch (error) {
      console.error("Error joining pool:", error);
      toast({
        title: "Failed to join pool",
        description:
          "There was an error joining this deal pool. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{pool.title}</CardTitle>
        <CardDescription>{pool.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>{members.length} joined</span>
            </span>
            <span className="text-primary">
              {members.length}/{pool.minTravelers} needed
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            <span>{timeRemaining()}</span>
          </div>
          {isExpired && (
            <div className="flex items-center text-destructive">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span>Pool expired</span>
            </div>
          )}
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Pool Members</h4>
          <div className="flex flex-wrap gap-2">
            {members.map((member) => (
              <Avatar
                key={member.id}
                className="h-8 w-8"
                title={`${member.user.firstName} ${member.user.lastName}`}
              >
                <AvatarImage
                  src={member.user.avatarUrl || undefined}
                  alt={`${member.user.firstName} ${member.user.lastName}`}
                />
                <AvatarFallback>{`${member.user.firstName?.[0]}${member.user.lastName?.[0]}`}</AvatarFallback>
              </Avatar>
            ))}
            {Array.from({
              length: Math.max(0, pool.minTravelers - members.length),
            }).map((_, i) => (
              <Avatar key={`empty-${i}`} className="h-8 w-8 opacity-30">
                <AvatarFallback>?</AvatarFallback>
              </Avatar>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleJoinPool}
          disabled={isJoining || hasJoined || isPoolFull || isExpired}
        >
          {isJoining
            ? "Joining..."
            : hasJoined
            ? "Already Joined"
            : isPoolFull
            ? "Pool Full"
            : isExpired
            ? "Expired"
            : "Join Pool"}
        </Button>
      </CardFooter>
    </Card>
  );
}
