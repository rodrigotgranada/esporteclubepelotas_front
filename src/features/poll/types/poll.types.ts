export interface PollOption {
  id: string;
  title: string;
  votesCount: number;
  displayOrder: number;
  percentage: number;
}

export interface Poll {
  id: string;
  title: string;
  description?: string;
  onlyMembers: boolean;
  active: boolean;
  startsAt?: string;
  endsAt?: string;
  totalVotes: number;
  userHasVoted: boolean;
  userVotedOptionId?: string;
  options: PollOption[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePollPayload {
  title: string;
  description?: string;
  onlyMembers?: boolean;
  active?: boolean;
  startsAt?: string;
  endsAt?: string;
  options: string[];
}

export interface UpdatePollPayload {
  title?: string;
  description?: string;
  onlyMembers?: boolean;
  active?: boolean;
  startsAt?: string;
  endsAt?: string;
}

