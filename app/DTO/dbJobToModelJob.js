/* eslint-disable camelcase */
module.exports = (dbJob) => {
  const {
    id,
    latitude,
    longitude,
    coordinate,
    type,
    coordinates,
    job_poster_id,
    title,
    urgency,
    status,
    gender_preference,
    age_preference,
    desc,
    price,
    created_at,
    updated_at,
    distance,
  } = dbJob;

  return {
    id,
    latitude,
    longitude,
    coordinate,
    type,
    coordinates,
    jobPosterId: job_poster_id,
    title,
    urgency,
    status,
    genderPreference: gender_preference,
    agePreference: age_preference,
    desc,
    price,
    createdAt: created_at,
    updatedAt: updated_at,
    distance,
  };
};
