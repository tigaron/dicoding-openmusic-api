const mapDBToModel = ({ created_at, updated_at, ...rest }) => ({
  ...rest,
  createdAt: created_at,
  updatedAt: updated_at,
});

module.exports = { mapDBToModel };
