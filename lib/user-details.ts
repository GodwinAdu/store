"use server"
import { headers } from 'next/headers';

export const getUserDetails = async () => {
  // Get the headers from the request
  const headersList = headers();
  const userAgent = headersList.get('user-agent');
  const platform = headersList.get('sec-ch-ua-platform') || userAgent;

  // Get public IP and location
  const ipResponse = await fetch('https://ipapi.co/json/');
  const locationData = await ipResponse.json();

  const location = {
    city: locationData.city,
    region: locationData.region,
    country: locationData.country,
    ip: locationData.ip,
  };

  return {
    browserName: userAgent,
    machineType: platform,
    location,
  };
};
