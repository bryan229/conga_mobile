import axios from './axios';
import API_URL from './apiUrl';
import { AxiosResponse } from 'axios';

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
    get: (url: string, params: {}) => axios.get(url, { params }).then(responseBody),
    post: (url: string, body: {}, params?: {}) => axios.post(url, body, params).then(responseBody),
    patch: (url: string, body: {}) => axios.patch(url, body).then(responseBody),
    delete: (url: string, params?: {}) => axios.delete(url, { params }).then(responseBody),
};

export const AuthApi = {
    login: (params: {}): Promise<any> => requests.post(`${API_URL.LOGIN_URL}`, params),
    refreshAccessToken: (params: {}): Promise<any> => requests.post(`${API_URL.REFRESH_TOKEN_URL}`, params),
    update: (params: {}): Promise<any> => requests.post(`${API_URL.UPDATEPROFILE_URL}`, params),
    me: (params: {}): Promise<any> => requests.post(`${API_URL.FETCH_ME_URL}`, params),
    delete: (params: any): Promise<any> => requests.delete(`${API_URL.USER_URL}`, params),
    uploadPhoto: (params: any): Promise<any> => {
        const formData = new FormData();
        formData.append('file', params.file);
        formData.append('_id', params._id);
        return requests.post(`${API_URL.UPLOAD_PHOTO_URL}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
};

export const UserApi = {
    signUp: (params: {}): Promise<any> => requests.post(`${API_URL.SIGNUP_URL}`, params),
    verify: (params: {}): Promise<any> => requests.post(`${API_URL.VERIFY_URL}`, params),
    subscribe: (params: {}): Promise<any> => requests.post(`${API_URL.SUBSCRIBE_URL}`, params),
    fetchMe: (params: {}): Promise<any> => requests.post(`${API_URL.FETCH_ME_URL}`, params),
    retrieveSponsors: (params: {}): Promise<any> => requests.get(`${API_URL.SEARCH_SPONSORS_URL}`, params),
    retrieve: (params: {}): Promise<any> => requests.get(`${API_URL.SEARCH_MEMBERS_URL}`, params),
    searchOpponents: (params: {}): Promise<any> => requests.get(`${API_URL.SEARCH_OPPONENT_URL}`, params),
    search: (params: {}): Promise<any> => requests.get(`${API_URL.SEARCH_USERS_URL}`, params),
    sendOpponentContactEmail: (params: {}): Promise<any> =>
        requests.post(`${API_URL.OPPONENT_CONTACTEMAIL_URL}`, params),
};

export const ClubApi = {
    retrieve: (params: {}): Promise<any> => requests.get(`${API_URL.SEARCH_CLUB_URL}`, params),
    retrieveMyClubs: (params: {}): Promise<any> => requests.get(`${API_URL.SEARCH_MYCLUBS_URL}`, params),
    read: (params: { _id: string }): Promise<any> => requests.get(`${API_URL.GET_CLUB_URL}/${params._id}`, params),
};

export const ClubMsgApi = {
    retrieve: (params: {}): Promise<any> => requests.get(`${API_URL.RETRIEVE_CLUBMSGS_URL}`, params),
};

export const ClubEventApi = {
    create: (params: {}): Promise<any> => requests.post(`${API_URL.CREATE_CLUBEVENTS_URL}`, params),
    update: (params: {}): Promise<any> => requests.post(`${API_URL.UPDATE_CLUBEVENTS_URL}`, params),
    read: (params: { _id: string }): Promise<any> => requests.get(`${API_URL.CLUBEVENTS_URL}/${params._id}`, params),
    retrieve: (params: {}): Promise<any> => requests.post(`${API_URL.RETRIEVE_CLUBEVENTS_URL}`, params),
    retrieveRegUsers: (params: {}): Promise<any> => requests.get(`${API_URL.RETRIEVE_CLUBEVENT_REGUSERS_URL}`, params),
    regUser: (params: {}): Promise<any> => requests.post(`${API_URL.CLUBEVENT_REGUSER_URL}`, params),
    unRegUser: (params: {}): Promise<any> => requests.post(`${API_URL.CLUBEVENT_UNREGUSER_URL}`, params),
    emergencyMessage: (params: {}): Promise<any> => requests.post(`${API_URL.CLUBEVENT_EMERGENCY_URL}`, params),
    retrieveHotEvents: (params: {}): Promise<any> => requests.get(`${API_URL.RETRIEVE_HOTEVENTS_URL}`, params),
};

export const MemberTypeApi = {
    retrieve: (params: {}): Promise<any> => requests.get(`${API_URL.RETRIEVE_MEMBERTYPES_URL}`, params),
};

export const RequestApi = {
    retrieve: (params: {}): Promise<any> => requests.get(`${API_URL.RETRIEVE_REQUESTS_URL}`, params),
    create: (params: {}): Promise<any> => requests.post(`${API_URL.CREATE_REQUEST_URL}`, params),
    update: (params: {}): Promise<any> => requests.post(`${API_URL.UPDATE_REQUEST_URL}`, params),
    delete: (params: {}): Promise<any> => requests.delete(`${API_URL.DELETE_REQUEST_URL}`, params),
};

export const ScheduleApi = {
    retrieve: (params: {}): Promise<any> => requests.get(`${API_URL.RETRIEVE_SCHEDULES_URL}`, params),
    read: (params: { _id: string }): Promise<any> => requests.get(`${API_URL.SCHEDULES_URL}/${params._id}`, params),
    create: (params: {}): Promise<any> => requests.post(`${API_URL.CREATE_REQUEST_URL}`, params),
    update: (params: {}): Promise<any> => requests.post(`${API_URL.UPDATE_SCHEDULE_URL}`, params),
    reserveShared: (params: {}): Promise<any> => requests.post(`${API_URL.RESERVE_SHARED_SCHEDULE_URL}`, params),
    cancelShared: (params: {}): Promise<any> => requests.post(`${API_URL.CANCEL_SHARED_SCHEDULE_URL}`, params),
    autoCheckIn: (params: {}): Promise<any> => requests.post(`${API_URL.AUTO_CHECkIN_SCHEDULE_URL}`, params),
};

export const PostApi = {
    create: (params: {}): Promise<any> => requests.post(`${API_URL.CREATE_POST_URL}`, params),
    retrieve: (params: {}): Promise<any> => requests.get(`${API_URL.RETRIEVE_POSTS_URL}`, params),
    delete: (params: {}): Promise<any> => requests.post(`${API_URL.DELETE_POST_URL}`, params),
    retrieveComments: (params: {}): Promise<any> => requests.get(`${API_URL.RETRIEVE_COMMENTS_URL}`, params),
    createComment: (params: {}): Promise<any> => requests.post(`${API_URL.CREATE_COMMENT_URL}`, params),
    deleteComment: (params: {}): Promise<any> => requests.post(`${API_URL.DELETE_COMMENT_URL}`, params),
};

export const ChatApi = {
    retrieveList: (params: {}): Promise<any> => requests.get(`${API_URL.RETRIEVE_CHATLIST_URL}`, params),
    retrieveMessages: (params: {}): Promise<any> => requests.get(`${API_URL.RETRIEVE_CHATHISTORY_URL}`, params),
    readUnReadChatList: (params: {}): Promise<any> => requests.post(`${API_URL.READ_UNREADCHATLIST_URL}`, params),
};

export const CircleApi = {
    retrieve: (params: {}): Promise<any> => requests.get(`${API_URL.CIRCLE_URL}`, params),
    create: (params: {}): Promise<any> => requests.post(`${API_URL.CIRCLE_URL}`, params),
    update: (params: {}): Promise<any> => requests.patch(`${API_URL.CIRCLE_URL}`, params),
    delete: (params: {}): Promise<any> => requests.delete(`${API_URL.CIRCLE_URL}`, params),
    read: (params: { _id: string }): Promise<any> => requests.get(`${API_URL.CIRCLE_URL}/${params._id}`, params),
    joinRequest: (params: {}): Promise<any> => requests.post(`${API_URL.CIRCLE_JOIN_REQUEST_URL}`, params),
    joinApprove: (params: {}): Promise<any> => requests.post(`${API_URL.CIRCLE_JOIN_APPROVE_URL}`, params),
    inviteMember: (params: {}): Promise<any> => requests.post(`${API_URL.CIRCLE_INVITE_MEMBER_URL}`, params),
    inviteAccept: (params: {}): Promise<any> => requests.post(`${API_URL.CIRCLE_INVITE_ACCEPT_URL}`, params),
    removeMember: (params: {}): Promise<any> => requests.post(`${API_URL.CIRCLE_REMOVE_MEMBER_URL}`, params),
};

export const CircleMessageApi = {
    retrieve: (params: {}): Promise<any> => requests.get(`${API_URL.CIRCLE_MESSAGE_URL}`, params),
    create: (params: {}): Promise<any> => requests.post(`${API_URL.CIRCLE_MESSAGE_URL}`, params),
};

export const ClubEventRequestApi = {
    create: (params: {}): Promise<any> => requests.post(`${API_URL.CLUBEVENT_REQUEST_URL}`, params),
};

export const CircleCommentApi = {
    retrieve: (params: {}): Promise<any> => requests.get(`${API_URL.CIRCLE_COMMENT_URL}`, params),
    create: (params: {}): Promise<any> => requests.post(`${API_URL.CIRCLE_COMMENT_URL}`, params),
};

export const ResourceApi = {
    retrieve: (params: {}): Promise<any> => requests.get(`${API_URL.FACILITY_RESOURCE_URL}`, params),
    read: (params: { _id: string }): Promise<any> =>
        requests.get(`${API_URL.FACILITY_RESOURCE_URL}/${params._id}`, params),
};

export const SubClubApi = {
    retrieve: (params: {}): Promise<any> => requests.get(`${API_URL.SUBCLUB_URL}`, params),
    read: (params: { _id: string }): Promise<any> => requests.get(`${API_URL.SUBCLUB_URL}/${params._id}`, params),
};

export const CouponApi = {
    validate: (params: {}): Promise<any> => requests.post(`${API_URL.COUPON_VALIDATE_URL}`, params),
};

export const StripeApi = {
    createCheckoutSession: (params: {}): Promise<any> =>
        requests.post(`${API_URL.STRIPE_URL}/checkout-sessions`, params),
    getCheckoutSession: (params: { session_id: string }): Promise<any> =>
        requests.get(`${API_URL.STRIPE_URL}/checkout-sessions/${params.session_id}`, params),
};
