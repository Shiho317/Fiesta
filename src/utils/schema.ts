import { z } from "zod";

export const UserSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
});

export const EventSchema = z.object({
  name: z.string(),
  hostId: z.string(),
  plannerId: z.string().optional().nullable(),
  venueId: z.string().optional().nullable(),
  eventDate: z.date(),
});

export const VenueSchema = z.object({
  name: z.string(),
  country: z.string(),
  state_province: z.string(),
  city: z.string(),
  address: z.string(),
  zipcode: z.string(),
  userId: z.string(),
});

export const PlannerSchema = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string().optional().nullable(),
  organization: z.string().optional().nullable(),
  userId: z.string(),
});

export const InvitationSchema = z.object({
  name: z.string(),
  email: z.string(),
  expiresAt: z.date(),
  templateId: z.string(),
  eventId: z.string(),
  invitedById: z.string(),
  user: z.object({
    name: z.string(),
    email: z.string(),
  }),
  sendAt: z.date().optional().nullable(),
});
