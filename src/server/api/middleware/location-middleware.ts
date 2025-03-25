"use client";

import { TRPCError } from "@trpc/server";
import { middleware } from "../trpc";

/**
 * Middleware to validate that location data is provided in the headers
 * This middleware will be applied to all procedures that require location data
 */
export const locationMiddleware = middleware(async ({ ctx, next }) => {
  // Extract location data from request headers
  const { headers } = ctx;
  const locationLat = headers.get("x-location-lat");
  const locationLng = headers.get("x-location-lng");
  const locationTime = headers.get("x-location-time");

  // Check if location data is provided
  if (!locationLat || !locationLng) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message:
        "Location data is required. Please enable location services and try again.",
    });
  }

  // Validate location data
  const lat = parseFloat(locationLat);
  const lng = parseFloat(locationLng);

  if (
    isNaN(lat) ||
    isNaN(lng) ||
    lat < -90 ||
    lat > 90 ||
    lng < -180 ||
    lng > 180
  ) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid location data provided.",
    });
  }

  // Add location data to context for use in procedures
  return next({
    ctx: {
      ...ctx,
      location: {
        lat,
        lng,
        timestamp: locationTime ? new Date(locationTime) : new Date(),
      },
    },
  });
});

/**
 * Procedure that requires location data
 * Use this for routes that need the user's location
 */
export const requireLocation = locationMiddleware;
