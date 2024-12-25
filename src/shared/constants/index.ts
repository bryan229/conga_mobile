export const VERSION_NUMBER = 41;
export const DEMOCLUB_ID = '00002';
export const DEFAULT_LOGO = 'https://tennislives.s3.amazonaws.com/logo.png';

export const LevelTypes: string[] = ['UTR', 'USTA', 'SELF', 'PRO'];

export enum LEVEL_TYPE {
    UTR,
    USTA,
    SELF,
    PRO,
}
export enum GENDER {
    MALE,
    FEMALE,
    NOPREFER,
    MIXED,
}
export enum CLUB_STATUS {
    INACTIVATED,
    ACTIVATED,
    BLOCKED,
}

export enum CLUB_TYPE {
    REAL = 'real',
    VIRTUAL = 'virtual',
}

export enum VENUE_STATUS {
    INACTIVATED,
    ACTIVATED,
}
export enum EMAILOPTIONS {
    ALL_REG_MEMBERS = 'all_reg_members',
    ALL_INVITED_MEMBERS = 'all_invited_members',
    ALL_MEMBERS = 'all_members',
}

export enum TEMPLATE_STATUS {
    WAIT,
    PUBLISHED,
    EXPIRED,
}

export enum CLUBMSG_TYPE {
    CLUB,
    CLUB_EVENT,
}

export enum QRCODE_TYPE {
    CLUB = 1,
    COURT = 2,
    RENT = 3,
    CMTYLOCATION = 4,
}

export enum VENUE_TYPE {
    REAL = 0,
    VIRTUAL = 1,
}

export const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const GUIDE_FILE_NAME: string = 'guide.mp3';

export enum LAYOUT_SCHEDULE {
    ONEPAGE,
    LISTDETAIL,
}

export enum EMERGENCYMSG_TYPE {
    EMAIL,
    MESSAGE,
    NOTIFICATION,
}

export enum SCHEDULE_STATUS {
    BLOCKED = -1,
    PENDING = 0,
    CONFIRM = 1,
    CANCELED = 2,
    OPEN = 3,
    CHALLENGE = 4,
}

export enum POST_STATUS {
    CREATED = 0,
    ACCEPTED = 1,
    PUBLISHED = 2,
}

export enum COMMENT_STATUS {
    DRAFT = 0,
    ADDED = 1,
}

export enum COMMENT_USERTYPE {
    ADVISOR = 0,
    CLUB = 1,
    MEMBER = 2,
}

export enum MSGCONTENT_TYPE {
    TEXT = 0,
    IMAGE = 1,
    VIDEO = 2,
    AUDIO = 3,
}

export enum CIRCLE_STATUS {
    INACTIVATED = 'inactivated',
    ACTIVATED = 'activated',
    BLOCKED = 'blocked',
}

export enum CIRCLEMESSAGE_POSTER_TYPE {
    MEMBER = 'member',
    CLUB = 'club',
}

export enum CIRCLE_MEMBER_STATUS {
    INVITED = 'invited',
    REQUESTED = 'requested',
    APPROVED = 'approved',
}

export enum MQTT_CLIENT_TYPE {
    CHAT = 'chat',
    CIRCLE_MESSAGE = 'circle_message',
}

export enum NOTIFICATION_SOURCE {
    SCHEDULE = 'schdule',
    REQUEST = 'request',
    PROFILE = 'profile',
    CHAT = 'chat',
    CLUBEVENT = 'clubevent',
    OPPONENT = 'opponent',
    CLUBMSG = 'clubmsg',
    CMTYEVENT = 'cmtyevent',
    CIRCLE = 'circle',
    CIRCLE_MESSAGE = 'circle_message',
}

export enum CIRCLE_NOTIDATA_TYPE {
    INVITATIONS = 'invitations',
    MYCIRCLES = 'mycircles',
    CIRCLES = 'circles',
}

export enum CIRCLEDETAILS_NOTIDATA_TYPE {
    MESSAGES = 'messages',
    MEMBERS = 'members',
}

export enum CLUBEVENT_REG_RESTRICT_TYPE {
    ONLY_CLUB_MEMBERS = 'only_club_members',
    ONLY_CIRCLE_MEMBERS = 'only_circle_members',
    ONLY_SUBCLUB_MEMBERS = 'only_subclub_members',
    ALL_MEMBERS = 'all_members',
    PARTICULAR_AREA = 'particular_area',
}

export enum CLUBEVENT_CREATE_BY {
    CLUB = 'club',
    USER = 'user',
}

export enum SUBSCRIPTION_PERIOD {
    MONTH = 'monthly',
    YEAR = 'yearly',
}

export enum PAYMENT_TYPE {
    CLUB_EVENT = 'clubevent',
    CLUB_SUBSCRIPTION = 'club_subscription',
}

export enum PAYMENT_STATUS {
    PAID = 'paid',
    UNPAID = 'unpaid',
    REFUNDED = 'refunded',
}

export enum SUBSCRIPTION_STATUS {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

export enum FILTER_DATE_REANGES {
    TODAY = 'today',
    ONE_WEEK = 'one_week',
    TWO_WEEKS = 'two_weeks',
    THIRTY_DAYS = 'thirty_days',
    NINETY_DAYS = 'ninety_days',
}

export enum FILTER_RADIUS {
    R10 = 10,
    R20 = 20,
    R30 = 30,
    R50 = 50,
    R100 = 100,
}

export enum CIRCLE_AGETYPES {
    ADULT = 'adult',
    JUNIOR = 'junior',
    SENIOR = 'senior',
}

export enum ELIGIBLE_GENDERS {
    MALE = 'male',
    FEMALE = 'female',
    MIXED = 'mixed',
}

export enum GUEST_STATUS {
    INACTIVATED = 'inactivated',
    ACTIVATED = 'activated',
}
