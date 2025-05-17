'use strict';

const { Contract } = require('fabric-contract-api');

class CodeRatingChaincode extends Contract {

    async createCode(ctx, codeId, username, codeContent, rating) {
        const code = {
            codeId,
            username,
            codeContent,
            rating: parseFloat(rating),
        };

        const existingCode = await ctx.stub.getState(codeId);
        if (existingCode && existingCode.length > 0) {
            throw new Error(`Code ${codeId} already exists`);
        }

        await ctx.stub.putState(codeId, Buffer.from(JSON.stringify(code)));
        return `Code ${codeId} created successfully by ${username}`;
    }

    async queryCode(ctx, codeId) {
        const codeJSON = await ctx.stub.getState(codeId);
        if (!codeJSON || codeJSON.length === 0) {
            throw new Error(`Code ${codeId} does not exist`);
        }
        return codeJSON.toString();
    }

    async updateRating(ctx, codeId, newRating) {
        const codeJSON = await ctx.stub.getState(codeId);
        if (!codeJSON || codeJSON.length === 0) {
            throw new Error(`Code ${codeId} does not exist`);
        }

        const code = JSON.parse(codeJSON.toString());
        code.rating = parseFloat(newRating);

        await ctx.stub.putState(codeId, Buffer.from(JSON.stringify(code)));
        return `Rating for code ${codeId} updated successfully`;
    }

    async listUserCodes(ctx, username) {
        const iterator = await ctx.stub.getStateByRange('', '');
        const allResults = [];

        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                const code = JSON.parse(res.value.value.toString('utf8'));
                if (code.username === username) {
                    allResults.push(code);
                }
            }
            if (res.done) {
                await iterator.close();
                break;
            }
        }

        return JSON.stringify(allResults);
    }

    async listAllCodes(ctx) {
        const iterator = await ctx.stub.getStateByRange('', '');
        const allResults = [];

        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                const code = JSON.parse(res.value.value.toString('utf8'));
                allResults.push(code);
            }
            if (res.done) {
                await iterator.close();
                break;
            }
        }

        return JSON.stringify(allResults);
    }
}

module.exports = CodeRatingChaincode;
