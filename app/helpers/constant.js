module.exports = {
  httpStatus: {
    ok: 200,
    badRequest: 400,
    unauthorized: 401,
    forbidden: 403,
    notFound: 404,
    internalServerError: 500,
  },
  messages: {
    duplicateCitizenshipId: 'No ktp sudah pernah di-input!',
    duplicateEmployeeId: 'Karyawan ini sudah memiliki user',
    duplicateEmail: 'Email ini sudah terdaftar',
    badRequest: 'Bad Request',
  },
  privateRoute: {
    GET: [
      '/job/nearby',
      '/job/contact-applicant',
      '/user/profile',
    ],
    POST: [
      '/job',
      '/job/:jobId/apply',
      '/job/:jobId/approve-application',
      '/job/:jobId/reject-application',
    ],
    PUT: [
      '/user/profile',
    ],
    DELETE: [],
  },
};
