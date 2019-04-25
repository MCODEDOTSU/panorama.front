import axios from 'axios';
import { baseUrlAPI } from '@/globals';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
import { elementResolverForSingleOrganizations } from '@/domain/entities/info/elements/elementResolverForSingleOrganizations';
import { elementResolverForInfoLists } from '@/domain/entities/info/elements/elementResolverForInfoLists';
import { newElementFormatter } from '@/domain/entities/info/elements/ElementFormatter';
import { elementResolverForTerritories } from '@/domain/entities/info/elements/elementResolverForTerritories';
export const state = {
    infoItems: [],
    infoItemsLists: [],
};
export const actions = {
    async getInfoElements({}, payload) {
        try {
            const res = await axios.get(`${baseUrlAPI}info/elements/${payload.layer_id}`);
            if (payload.type_layer === 'infoLists') {
                state.infoItemsLists = elementResolverForInfoLists(res.data);
            }
            else if (payload.type_layer === 'territories') {
                state.infoItemsLists = elementResolverForTerritories(res.data);
            }
            else {
                state.infoItems = elementResolverForSingleOrganizations(res.data);
            }
        }
        catch {
            ErrorNotifier.notify();
        }
    },
    async editInfoElement({}, payload) {
        const url = `${baseUrlAPI}info/${payload.infoItem.geotype}`;
        try {
            const res = await axios.put(url, payload.infoItem);
        }
        catch {
            ErrorNotifier.notify();
        }
    },
    async createInfoElement({}, payload) {
        const url = `${baseUrlAPI}info/${payload.infoItem.geotype}/${payload.layer_id}`;
        try {
            const res = await axios.post(url, payload.infoItem);
            state.infoItems.push(newElementFormatter(res.data));
        }
        catch {
            ErrorNotifier.notify();
        }
    },
    async deleteInfoElement({}, payload) {
        const url = `${baseUrlAPI}info/${payload.infoItem.geotype}/${payload.id}`;
        try {
            const res = await axios.delete(url);
        }
        catch {
            ErrorNotifier.notify();
        }
    },
    async createInfoElementSingle({}, payload) {
        const url = `${baseUrlAPI}info/${payload.infoItem.geotype}/create/singleCreate`;
        try {
            const res = await axios.post(url, payload.infoItem);
            state.infoItems.push(newElementFormatter(res.data));
        }
        catch {
            ErrorNotifier.notify();
        }
    },
};
export const infoitem = {
    state, actions,
};
//# sourceMappingURL=infoitem.js.map