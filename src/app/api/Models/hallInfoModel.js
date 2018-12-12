const storage = require('../../../app/components/storage');
const mysql = require('promise-mysql');
const log = require('../../../app/components/log.js')(module);
const baseDbModel = require('./baseDbModel');
const constants = require('./constants');

/**
 * @class {hallInfoModel}
 */
class hallInfoModel extends baseDbModel{
    constructor(country){
        super(country);
    }
    /**
     * @param {Array} gameKinds gk
     * @param {Date} startDate date
     * @returns {Promise.<*>} Map
     */
    async getFirstGameID() {
        const mdbPool = storage.getConnection(
            constants.constDbList.DB_TYPE_MYSQL,
            constants.constDbList.DB_MASTER
        );
        const conn = await (await mdbPool).getConnection();
        const query =
            `
            SELECT * from ${this.db_name}.clients Where cli_id = 7;
            `;
        
        try {
            return await conn.query(query);
        } catch (error) {
            throw error;
        } finally {
            await (await mdbPool).releaseConnection(conn);
        }
    }

    /**
     * @param {Array} participantsHalls halls
     * @param {Array} gameKinds gk
     * @returns {Promise.<*>} Map
     */
    async getBetSums({participantsHalls, lastGameIDs, currentGameIDs, startDate, acceptBonuses, acceptJackpots}) {
        const conn = await (await this.mdbPool).getConnection();

        const query =
            `
            SELECT
                persons.wallet_id as walletID
                ,wins.ws as "winSum"
                ,wins.bs as "betSum"
                ,document as "docType"
                ,docNumber
                ,hall_id as "hallID"
                ,game_kind as "gameKind"
                ,phone

            FROM (

                SELECT wallet_id, sum(win_sum) as ws, game_kind, sum(bet_sum) AS bs FROM (

                    SELECT wallet_id, win_sum + ${acceptJackpots ? 'jp_sum' : '0'} AS win_sum, game_kind, price AS bet_sum FROM tickets
                        INNER JOIN ticket_sells ON tickets.sell_id = ticket_sells.sell_id
                    WHERE
                        win_sum > 0
                        ${acceptBonuses ? ' ' : 'AND bonus = 0 '}
                        AND tickets.hall_id In (:ticketsHalls)
                        AND reg_dttm >= :ticketsDTTMBegin AND ($>gameRange<)

                    UNION ALL

                    SELECT wallet_id, win_sum, game_kind, bet_sum FROM bets
                    WHERE
                        win_sum > 0
                        ${acceptBonuses ? ' ' : 'AND bonus = 0 '}
                        AND bets.hall_id In (:betsHalls)
                        AND bet_dttm >= :betsDTTMBegin AND ($>gameRange<)) as bt

                GROUP BY wallet_id, game_kind
                 ORDER BY null) as wins

            JOIN persons ON (wins.wallet_id = persons.wallet_id)
            JOIN wallets ON (persons.wallet_id = wallets.wallet_id)
            WHERE left(wallets.phone, 1) <> '0'
            `;

        try {
            const replacement = this._prepareGameID(currentGameIDs, lastGameIDs);
            const que = query.replace(/\$>gameRange</g, replacement);

            // const qr = await conn.format(que, {
            //     ticketsHalls: participantsHalls,
            //     betsHalls: participantsHalls,
            //     ticketsDTTMBegin: startDate,
            //     betsDTTMBegin: startDate,
            // });

            const queryResult = await conn.query(que, {
                ticketsHalls: participantsHalls,
                betsHalls: participantsHalls,
                ticketsDTTMBegin: startDate,
                betsDTTMBegin: startDate,
            });

            return queryResult;
        } catch (error) {
            throw error;
        } finally {
            await (await this.mdbPool).releaseConnection(conn);
        }
    }

    /**
     *
     * @param {*} param0
     */
    async getBetSumsWithGameKinds({participantsHalls, lastGameIDs, currentGameIDs, startDate, acceptBonuses, acceptJackpots}) {
        const conn = await (await this.mdbPool).getConnection();

        const query =
            `
            SELECT
                persons.wallet_id as walletID
                ,wins.ws as "winSum"
                ,wins.bs as "betSum"
                ,document as "docType"
                ,docNumber
                ,hall_id as "hallID"
                ,game_kind as "gameKind"
                ,phone

            FROM (

                SELECT wallet_id, sum(win_sum) as ws, game_kind, sum(bet_sum) as bs FROM (

                    SELECT wallet_id, win_sum + ${acceptJackpots ? 'jp_sum' : '0'} AS win_sum, game_kind, price AS bet_sum FROM tickets
                        INNER JOIN ticket_sells ON tickets.sell_id = ticket_sells.sell_id
                    WHERE
                        win_sum > 0
                        ${acceptBonuses ? ' ' : 'AND bonus = 0 '}
                        AND tickets.hall_id In (:ticketsHalls)
                        AND reg_dttm >= :ticketsDTTMBegin AND ($>gameRange<)

                    UNION ALL

                    SELECT wallet_id, win_sum, game_kind, bet_sum FROM bets
                    WHERE
                        win_sum > 0
                        ${acceptBonuses ? ' ' : 'AND bonus = 0 '}
                        AND bets.hall_id In (:betsHalls)
                        AND bet_dttm >= :betsDTTMBegin AND ($>gameRange<)) as bt

                GROUP BY wallet_id, game_kind
                 ORDER BY null) as wins

            JOIN persons ON (wins.wallet_id = persons.wallet_id)
            JOIN wallets ON (persons.wallet_id = wallets.wallet_id)
            WHERE left(wallets.phone, 1) <> '0'
            `;

        try {
            const replacement = this._prepareGameID(currentGameIDs, lastGameIDs);

            const que = query.replace(/\$>gameRange</g, replacement);

            const bq = await conn.query(que, {
                ticketsHalls: participantsHalls,
                betsHalls: participantsHalls,
                ticketsDTTMBegin: startDate,
                betsDTTMBegin: startDate,
            });

            return bq;
        } catch (error) {
            throw error;
        } finally {
            await (await this.mdbPool).releaseConnection(conn);
        }
    }

    /**
     * get wins sums for accept_bonuses switch
     * @returns {Array} list wallets with wins
     */
    async getBetBonuses({participantsHalls, lastGameIDs, currentGameIDs, startDate, bonus, acceptJackpots}) {
        const pool = await this.mdbPool;
        const conn = await pool.getConnection();

        const query =
            `
            SELECT
                persons.wallet_id as walletID
                ,${bonus ? 1 : -1} * wins.ws as "winSum"
                ,wins.bs as "betSum"
                ,document as "docType"
                ,docNumber
                ,hall_id as "hallID"
                ,game_kind as "gameKind"
                ,phone

            FROM (

                SELECT wallet_id, sum(win_sum) as ws, game_kind, sum(bet_sum) as bs FROM (

                    SELECT wallet_id, win_sum + ${acceptJackpots ? 'jp_sum' : '0'} AS win_sum, game_kind, price AS bet_sum FROM tickets
                        INNER JOIN ticket_sells ON tickets.sell_id = ticket_sells.sell_id
                    WHERE
                        win_sum > 0
                        AND bonus = 1
                        AND tickets.hall_id In (:ticketsHalls)
                        AND reg_dttm >= :ticketsDTTMBegin AND ($>gameRange<)

                    UNION ALL

                    SELECT wallet_id, win_sum, game_kind, bet_sum FROM bets
                    WHERE
                        win_sum > 0
                        AND bonus = 1
                        AND bets.hall_id In (:betsHalls)
                        AND bet_dttm >= :betsDTTMBegin AND ($>gameRange<)) as bt

                GROUP BY wallet_id, game_kind
                 ORDER BY null) as wins

            JOIN persons ON (wins.wallet_id = persons.wallet_id)
            JOIN wallets ON (persons.wallet_id = wallets.wallet_id)
            WHERE left(wallets.phone, 1) <> '0'
            `;
        try {
            const replacement = this._prepareGameID(currentGameIDs, lastGameIDs);

            const que = query.replace(/\$>gameRange</g, replacement);

            const walletsWithWins = await conn.query(que, {
                ticketsHalls: participantsHalls,
                betsHalls: participantsHalls,
                ticketsDTTMBegin: startDate,
                betsDTTMBegin: startDate,
            });

            return walletsWithWins;
        } catch (error) {
            throw error;
        } finally {
            await pool.releaseConnection(conn);
        }
    }

    /**
     * get diff jackpots bets
     * @param {Object} param0 data race
     * @returns {Array} win sums
     */
    async getBetJackpots({participantsHalls, lastGameIDs, currentGameIDs, startDate, acceptBonuses, acceptJackpots}) {
        const pool = await this.mdbPool;
        const conn = await pool.getConnection();

        const query =
            `
            SELECT
                persons.wallet_id as walletID
                ,${acceptJackpots ? 1 : -1} * wins.js as "winSum"
                ,price as "betSum"
                ,document as "docType"
                ,docNumber
                ,hall_id as "hallID"
                ,game_kind as "gameKind"
                ,phone

            FROM (

                SELECT wallet_id, sum(jp_sum) as js, game_kind, sum(price) as price FROM (

                    SELECT wallet_id, jp_sum, game_kind, price FROM tickets
                        INNER JOIN ticket_sells ON tickets.sell_id = ticket_sells.sell_id
                    WHERE
                        win_sum > 0
                        ${acceptBonuses ? ' ' : 'AND bonus = 0 '}
                        AND tickets.hall_id In (:ticketsHalls)
                        AND reg_dttm >= :ticketsDTTMBegin AND ($>gameRange<) ) as t

                GROUP BY wallet_id, game_kind
                 ORDER BY null) as wins

            JOIN persons ON (wins.wallet_id = persons.wallet_id)
            JOIN wallets ON (persons.wallet_id = wallets.wallet_id)
            WHERE left(wallets.phone, 1) <> '0'
            `;
        try {
            const replacement = this._prepareGameID(currentGameIDs, lastGameIDs);

            const que = query.replace(/\$>gameRange</g, replacement);

            const walletsWithWins = await conn.query(que, {
                ticketsHalls: participantsHalls,
                betsHalls: participantsHalls,
                ticketsDTTMBegin: startDate,
                betsDTTMBegin: startDate,
            });

            return walletsWithWins;
        } catch (error) {
            throw error;
        } finally {
            await pool.releaseConnection(conn);
        }
    }

    /**
     *
     * @param {*} param0
     */
    async getHallGsRelation({participantsHalls}) {
        const conn = await (await this.mdbPool).getConnection();


        const query =
            `
            SELECT gs_id as "gsID", group_concat(hall_id SEPARATOR ',') as "hallIDs"
            FROM halls
            WHERE hall_id IN (:participantsHalls)
             GROUP BY gs_id
            ORDER BY NULL;
            `;

        try {
            const result = await conn.query(query, {participantsHalls});

            const dataMap = result.reduce((map, {gsID, hallIDs}) =>
                map.set(gsID, JSON.parse(`[${hallIDs}]`)), new Map());

            return dataMap;
        } catch (error) {
            throw error;
        } finally {
            await (await this.mdbPool).releaseConnection(conn);
        }
    }

    async getLastGameIDsByGS({gsID}) {
        const conn = await (await this.mdbPool).getConnection();

        const query =
            `
            SELECT gs_id as "gsID", game_kind as "gameKind", last_game_id - 1 as "lastGameID" FROM gs_rand
            INNER JOIN game_kinds ON (gs_rand.rng_id = game_kinds.rng_id)
            WHERE gs_id IN (:gsID);
            `;

        try {
            const result = await conn.query(query, {gsID});

            const dataMap = result.reduce((map, {gsID, gameKind, lastGameID}) => {
                if (map.has(gsID)) {
                    map.get(gsID)[gameKind] = lastGameID;
                } else {
                    const obj = {};
                    obj[gameKind] = lastGameID;
                    map.set(gsID, obj);
                }

                return map;
            }, new Map());

            return dataMap;
        } catch (error) {
            throw error;
        } finally {
            await (await this.mdbPool).releaseConnection(conn);
        }
    }

    /**
     * get part query
     * @param {Map} currentGameIDs cgid
     * @param {Map} lastGameIDs lgid
     * @returns {string} part query
     * @private
     */
    _prepareGameID(currentGameIDs, lastGameIDs) {
        let i = 0;
        const len = currentGameIDs.size;
        let resultStr = '';

        for (const [gameKind, gameID] of currentGameIDs) {
            if (lastGameIDs.has(gameKind)) {
                const prevKindGID = lastGameIDs.get(gameKind);
                const or = i === len - 1 ? '' : ' OR ';
                resultStr =
                    `${resultStr} (game_kind = ${mysql.escape(gameKind)}
                                     AND game_id BETWEEN ${mysql.escape(prevKindGID)}
                                     AND ${mysql.escape(gameID)}) ${or}`;
                i++;
            }
        }
        return resultStr;
    }
}

module.exports = hallInfoModel;
