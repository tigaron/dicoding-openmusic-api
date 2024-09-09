/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.createTable('playlists', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        name: {
            type: 'TEXT',
            notNull: true,
        },
        owner: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
    });
    pgm.addConstraint('playlists', 'fk_playlists_owner', {
        foreignKeys: {
            columns: 'owner',
            references: 'users(id)',
            onDelete: 'CASCADE',
        },
    });
    pgm.createTable('playlist_songs', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        playlist_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        song_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
    });
    pgm.addConstraint('playlist_songs', 'fk_playlistsongs_playlist_id', {
        foreignKeys: {
            columns: 'playlist_id',
            references: 'playlists(id)',
            onDelete: 'CASCADE',
        },
    });
    pgm.addConstraint('playlist_songs', 'fk_playlistsongs_song_id', {
        foreignKeys: {
            columns: 'song_id',
            references: 'songs(id)',
            onDelete: 'CASCADE',
        },
    });
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('playlist_songs');
    pgm.dropTable('playlists');
};
