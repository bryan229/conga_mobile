const apiUrl = {
    BASE_URL: process.env.SERVER_URL,
    REFRESH_TOKEN_URL: '/api/auth/refresh-token',

    LOGIN_URL: '/api/user/login',
    SIGNUP_URL: '/api/user/signup',
    VERIFY_URL: '/api/user/verify',
    SUBSCRIBE_URL: '/api/user/subscribe',
    UPLOAD_PHOTO_URL: '/api/user/upload-photo',
    UPDATEPROFILE_URL: '/api/user/update',
    SEARCH_SPONSORS_URL: '/api/user/search_sponsors',
    SEARCH_MEMBERS_URL: '/api/user/search',
    SEARCH_MYCLUBS_URL: '/api/user/search_myclubs',
    FETCH_ME_URL: '/api/user/me',
    USER_URL: '/api/user',
    SEARCH_USERS_URL: '/api/user/search',
    SEARCH_OPPONENT_URL: '/api/user/search_opponent',
    OPPONENT_CONTACTEMAIL_URL: '/api/user/email_to_oppoent',

    SEARCH_CLUB_URL: '/api/club/search',
    GET_CLUB_URL: '/api/club',
    GET_SERVICEDETAILS_URL: '/api/club/details',

    RETRIEVE_CLUBMSGS_URL: '/api/clubmessage/search',

    CREATE_CLUBEVENTS_URL: '/api/clubevent/create',
    UPDATE_CLUBEVENTS_URL: '/api/clubevent/update',
    CLUBEVENTS_URL: '/api/clubevent',
    RETRIEVE_CLUBEVENTS_URL: '/api/clubevent/search',
    RETRIEVE_CLUBEVENT_REGUSERS_URL: '/api/clubevent/find_regusers',
    CLUBEVENT_REGUSER_URL: '/api/clubevent/reg_user',
    CLUBEVENT_UNREGUSER_URL: '/api/clubevent/remove_user',
    CLUBEVENT_EMERGENCY_URL: '/api/clubevent/emergency',
    RETRIEVE_HOTEVENTS_URL: '/api/clubevent/hot-events',

    RETRIEVE_MEMBERTYPES_URL: '/api/membertype/search',

    RETRIEVE_REQUESTS_URL: '/api/request/search',
    CREATE_REQUEST_URL: '/api/request/create',
    UPDATE_REQUEST_URL: '/api/request/update',
    DELETE_REQUEST_URL: '/api/request/delete',

    SCHEDULES_URL: '/api/schedule',
    RETRIEVE_SCHEDULES_URL: '/api/schedule/search',
    UPDATE_SCHEDULE_URL: '/api/schedule/update',
    RESERVE_SHARED_SCHEDULE_URL: '/api/schedule/reserve-shared',
    CANCEL_SHARED_SCHEDULE_URL: '/api/schedule/cancel-shared',
    AUTO_CHECkIN_SCHEDULE_URL: '/api/schedule/auto-checkin',

    CREATE_POST_URL: '/api/post/create',
    RETRIEVE_POSTS_URL: '/api/post/search',
    RETRIEVE_COMMENTS_URL: '/api/comment/search',
    CREATE_COMMENT_URL: '/api/comment/create',
    DELETE_COMMENT_URL: '/api/comment/delete',
    DELETE_POST_URL: '/api/post/delete',

    RETRIEVE_CHATLIST_URL: '/api/chat/list',
    READ_UNREADCHATLIST_URL: '/api/chat/list_read',
    RETRIEVE_CHATHISTORY_URL: '/api/chat/history',

    CIRCLE_URL: '/api/circle',
    CIRCLE_JOIN_REQUEST_URL: '/api/circle/join-request',
    CIRCLE_JOIN_APPROVE_URL: '/api/circle/join-approve',
    CIRCLE_REMOVE_MEMBER_URL: '/api/circle/remove-member',
    CIRCLE_INVITE_ACCEPT_URL: '/api/circle/invite-accept',
    CIRCLE_INVITE_MEMBER_URL: '/api/circle/invite-member',

    CIRCLE_MESSAGE_URL: '/api/circle-message',
    CIRCLE_COMMENT_URL: '/api/circle-comment',

    CLUBEVENT_REQUEST_URL: '/api/clubevent-request',

    FACILITY_RESOURCE_URL: '/api/facility-resource',

    COUPON_VALIDATE_URL: '/api/coupon/validate',

    SUBCLUB_URL: '/api/sub-club',

    STRIPE_URL: '/api/stripe',
};

export default apiUrl;
