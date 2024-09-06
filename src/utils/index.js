/* eslint-disable camelcase */
const mapDBToModel = ({ created_at, updated_at, ...rest }) => ({
  ...rest,
  createdAt: created_at,
  updatedAt: updated_at,
});
/* eslint-enable camelcase */

const mapSongDBToModel = ({ id, title, performer }) => ({
  id,
  title,
  performer,
});

module.exports = { mapDBToModel, mapSongDBToModel };
