import {
    CLUBEVENT_REG_RESTRICT_TYPE,
    CLUBMSG_TYPE,
    COMMENT_STATUS,
    COMMENT_USERTYPE,
    GENDER,
    LAYOUT_SCHEDULE,
    LEVEL_TYPE,
    MSGCONTENT_TYPE,
    POST_STATUS,
    SCHEDULE_STATUS,
    CIRCLEMESSAGE_POSTER_TYPE,
    CIRCLE_MEMBER_STATUS,
    CIRCLE_STATUS,
    TEMPLATE_STATUS,
    VENUE_STATUS,
    VENUE_TYPE,
    CLUB_TYPE,
    SUBSCRIPTION_PERIOD,
    CLUBEVENT_CREATE_BY,
    PAYMENT_STATUS,
    SUBSCRIPTION_STATUS,
    CIRCLE_AGETYPES,
    ELIGIBLE_GENDERS,
    GUEST_STATUS,
} from '@shared/constants';

export interface Club {
    _id: string;
    ID: string;
    stripeId?: string;
    displayName: string;
    email: string;
    websiteUrl?: string;
    mobilePhone?: string;
    company?: string;
    facility?: string;
    logoUrl?: string;
    plannedCourtsCount: number;
    activatedCourtsCount: number;
    status: number;
    allowReservations: boolean;
    allowCmtyEvent: boolean;
    allowUserSignUp?: boolean;
    setting?: ClubSetting;
    isDefault: boolean;
    isIdeaDefault: boolean;
    preferPaymentService?: string;
    timezone: string;
    venues: Venue[];
    type: CLUB_TYPE;
}

export interface SubClub {
    _id: string;
    club: string;
    name: string;
    mclClub?: string;
    resourceManager: string;
    state?: string;
    city?: string;
    address: string;
    zipCode: string;
    geoLocation: {
        type: 'Point';
        coordinates: number[];
    };
    distance?: number;
}

export interface Venue {
    _id: string;
    ID: string;
    club: string;
    displayName: string;
    courtDisplayName: string;
    setting: VenueSetting;
    waitListTemplate: RequestTemplate;
    releasedTemplates: RequestTemplate[];
    rsStDate: string;
    rsEtDate: string;
    type: VENUE_TYPE;
    isCheckedNextCycle: boolean;
    isReqAccessCode: boolean;
    accessCode?: string;
    status: VENUE_STATUS;
}

export interface VenueRuleSettings {
    hasLocation: boolean;
    multiReservationPerDay: boolean;
    maxNumOfRsPerDay: number;
    hasMaxNumPerMonth: boolean;
    maxNumPerMonth: number;
    maxNumOfReqPerWeek: number;
    maxNumOfAssignedRsPerWeek: number;
    maxNumOfRsPerWeek: number;
    continuosTwoDay: boolean;
    continuosTwoDayIgnore: boolean;
    triggerNum: number;
    requireTraining: boolean;
    canReserveOpenCourt: boolean;
    canReserveCancelMember: boolean;
    isIncludeCancelInLimit: boolean;
    isEmailingUnConfirmedSched: boolean;
    unConfirmedShcedEmailingDays: number;
    isEmailingConfirmedSched: boolean;
    confirmedShcedEmailingDays: number;
    isCanceledIfNotConfirmed: boolean;
    cancelPeriod: number;
    runCronEachDay: boolean;
    canMakeChallenge: boolean;
    reclassifiedName: string;
    isReqOtherPyName: boolean;
    playerCount: number;
    isShouldPyMember: boolean;
    isShowOtherPyLevel: boolean;
    isRequireCheckIn: boolean;
    blockRequstOfNoShowMember: boolean;
    blockRequestCycleCount: number;
    requestBlockMessage: string;
    allowReserveNonMember: boolean;
    canNonMemberReserveDays: number;
    allowReserveStaff: boolean;
    canStaffReserveDays: number;
    autoAssignWaitList: boolean;
    allowMemeberNameInSched: boolean;
    isIncludeShareTSInRSCountPerDay: boolean;
    maxShareCountPerDay: number;
    maxShareMemNumPerTimeSlot: number;
}

export interface VenueSetting {
    activatedLocations: string[];
    ruleSettings: VenueRuleSettings;
    checkInSponsor: string;
    courtCount: number;
    activatedCourts: number[];
    timeSlotInterval: number;
    timeSlots: string[];
    courtTimeSettings: CTSetting[];
    curtCourtCount: number;
    curtActivatedCourts: number[];
    curtTimeSlotInterval: number;
    curtTimeSlots: string[];
    curtCourtTimeSettings: CTSetting[];
    schedSettings: SchedSettings;
    autoSchedMacroSettings: AutoSchedMacroSettings;
    allowedSameDayVenues: string[];
}

export interface CTSetting {
    court: number;
    time: number;
    day: number;
    isBlocked: boolean;
    displayColor: string;
    isTemp: boolean;
    reason: string;
}

export interface SchedSettings {
    elgStartScore: number;
    inelgStartScore: number;
    priorRsScores: number[];
    reqCountScores: number[];
    rsHistoryScores: number[];
    rsHistoryDays: number[];
    lateCancelationScores: number[];
}

export interface AutoSchedMacroSettings {
    isAllow: boolean;
    runDay: number;
    runTime: number;
    weeks: number;
    startDate: string;
    courts: number[];
    allowNewSchedEmail: boolean;
    allowNewReuestEmail: boolean;
}

export interface RequestTemplate {
    _id: string;
    ID: string;
    stDate: string;
    etDate: string;
    timeSlots: string[];
    dateTimeSettings: {
        date: number;
        time: number;
    }[];
    status: TEMPLATE_STATUS;
    venue: string;
}

export interface ClubSetting {
    _id: string;
    isClosed: boolean;
    closeMessage?: string;
    canReserveDays: number;
    allowForum: boolean;
    layout: {
        schedule: LAYOUT_SCHEDULE;
    };
    allowClubService: boolean;
    noReturnRentMessage: string;
    avtTimeSlots: AvtTimeSlot[];
    eventTypes: string[];
    forumCategories: string[];
    eventEmailDate: number;
    cmtyEventEmailDate: number;
    eventSponsorAuthorizations: any;
    cmtyAdvocatorAuthorizations: any;
    allowVirtualCmtyEvent: boolean;
    autoMessages: AutoMessageSetting[];
    geoZipCodes: string[];
    cmtyEventDiscountPercent: number;
    isReqSubscription: boolean;
    subscription: {
        price: number;
        period: SUBSCRIPTION_PERIOD;
    };
}

export interface AvtTimeSlot {
    name: string;
    stTime: string;
    etTime: string;
}

export interface AutoMessageSetting {
    title: string;
    startDate: string;
    runDay: number;
    livePeriod: number;
    message: string;
    repeatWeeks: number;
}

export interface ClubMsg {
    _id: string;
    club: Club | string;
    startDate: string;
    endDate: string;
    content: string;
    type?: CLUBMSG_TYPE;
}

export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    gender?: GENDER;
    email: string;
    phoneNumber?: string;
    zipCode?: string;
    photoUrl?: string;
    birthYear?: string;
    address?: string;
    age?: number;
    club?: Club | string;
    isReceiveEmail?: boolean;
    isRecevieNotification?: boolean;
    gameLevel?: number;
    levelType?: LEVEL_TYPE;
    isActivated?: boolean;
    preferredVenue?: string;
    memberType: MemberType;
    availability: UserAvt[];
    isSponsor?: boolean;
    isBlocked?: boolean;
    stripeId?: string;
    subscription: {
        id: string;
        status: SUBSCRIPTION_STATUS;
        paymentStatus: PAYMENT_STATUS;
        startDate: number;
        nextPaymentDate: number;
        paymentIntentId: string;
    };
}

export interface UserAvt {
    weekDay: number;
    timeSlot: string;
    expireDate: string;
}

export interface MemberType {
    _id: string;
    name: string;
    club: string;
    isBlocked: boolean;
    isAllowAVT: boolean;
    isAllowClubEvent: boolean;
    isAllowClubService: boolean;
    permissions: MemberTypePermission[];
}

export interface MemberTypePermission {
    venue: string;
    isAllowSched: boolean;
    isAllowReserveOTS: boolean;
    reserveOTSAdvancedDay: number;
    isAllowReq: boolean;
    allowSchedTimeRanges: AllowDayTimeRange[];
    allowReqTimeRanges: AllowDayTimeRange[];
}

export interface AllowDayTimeRange {
    day: number;
    timeRanges: TimeRange[];
}

export interface TimeRange {
    stTime: string;
    etTime: string;
}

export interface ClubEvent {
    _id: string;
    groupId: string;
    club: Club;
    title: string;
    description: string;
    start: string;
    end: string;
    eventType: string;
    venue?: Venue;
    courts?: number[];
    locations?: string[];
    resource?: any;
    geoLocation: {
        type: 'Point';
        coordinates: number[];
    };
    sponsor?: User | string;
    eligibleGender?: number;
    eligibleLevel?: {
        from: number;
        to: number;
    };
    noExpired?: boolean;
    isRequireReg: boolean;
    minRegCount?: number;
    maxRegCount?: number;
    invitedMemberTypes?: string[];
    regRestrictType: CLUBEVENT_REG_RESTRICT_TYPE;
    invitedCircles?: Circle[];
    invitedZipCode?: string;
    canRegMultiWeeks: boolean;
    maxRegMultiWeeks?: number;
    displayColor: string;
    photoUrl?: string;
    isRequireThirdPartyLink: boolean;
    thirdPartyLink?: string;
    isRequireMsg: boolean;
    clubMsg?: ClubMsg;
    isFree?: boolean;
    price?: number;
    discount?: number;
    createdBy?: CLUBEVENT_CREATE_BY;

    // this is not db fields
    regUsers: ClubEventRegUser[];
    repeatedWeeks: number;
}

export interface ClubEventRegUser {
    _id: string;
    event: string;
    user: User;
    guests: number;
    createdAt: string;
}

export interface Request {
    _id: string;
    template: RequestTemplate;
    date: string;
    time?: string;
    isAnyTime: boolean;
    timeRange?: string;
    isAssignCanceled: boolean;
    user: User;
    venue: string;
}

export interface Schedule {
    _id: string;
    date: string;
    time: string;
    court: number;
    owner: User;
    tempOwner: string;
    venue: Venue;
    blockedReason?: string;
    blockedColor?: string;
    members: OtherPlayer[];
    status: SCHEDULE_STATUS;
    isLateCancel?: boolean;
    isChallenge?: boolean;
    isArrived?: boolean;
    isSharing?: boolean;
    initStatusByAutoSchedRoutine: SCHEDULE_STATUS;
    circleMessage?: string;
}

export interface OtherPlayer {
    fullName: string;
    email?: string;
    mobilePhone?: string;
    gameLevel?: number;
    levelType?: number;
    isMember: boolean;
    isShareUser: boolean;
}

export interface Post {
    _id: string;
    author: User;
    hideAuthor: boolean;
    category: string;
    title: string;
    summary: string;
    content: string;
    advisorCommentCount: number;
    adminCommentCount: number;
    memberCommentCount: number;
    isReplyMember: boolean;
    club: Club;
    status: POST_STATUS;
    createdAt: string;
}

export interface Comment {
    _id: string;
    post: string;
    commentClub: Club;
    commentAdvisor: User;
    commentMember: User;
    content: string;
    commentUserType: COMMENT_USERTYPE;
    status: COMMENT_STATUS;
    createdAt: string;
}

export interface ChatList {
    _id: string;
    userId: string;
    partnerId: User;
    latestMsg: string;
    latestMsgType: boolean;
    isRead: boolean;
    updatedAt: string;
}

export interface ChatMessage {
    _id: string;
    userId: string;
    partnerId: string;
    msg: string;
    msgType: boolean;
    contentType: MSGCONTENT_TYPE;
    isRead: boolean;
    createdAt: string;
    showDateGroup?: boolean; // be used on only front side
}

export interface Circle {
    _id: string;
    club: string;
    subClub?: SubClub | string;
    name: string;
    slug: string;
    description: string;
    leader: User;
    state?: string;
    county?: string;
    city?: string;
    eligibleGender?: ELIGIBLE_GENDERS;
    eligibleLevel?: {
        from: number;
        to: number;
    };
    ageRanges?: CIRCLE_AGETYPES[];
    members: CircleMember[];
    status: CIRCLE_STATUS;
    createdAt: string;
}

export interface CircleMember {
    user: User;
    status: CIRCLE_MEMBER_STATUS;
    updatedDate: number;
}

export interface CircleMessage {
    _id: string;
    circle: string;
    poster: User;
    invitedMembers: string[];
    isPublic: boolean;
    message: string;
    totalComments: number;
    createdBy: CIRCLEMESSAGE_POSTER_TYPE;
    comments: CircleComment[];
    createdAt: string;
    eventGroupId?: string;
    schedule?: {
        _id: string;
        members: OtherPlayer[];
        canReg: boolean;
    };
    eventRegUsers?: string[];
    eventId?: string;
    referenceResourceId?: string;
}

export interface CircleComment {
    _id: string;
    user: User;
    message: string;
    createdAt: string;
}

export interface FacilityResource {
    _id: string;
    groupId: string;
    club: Club | string;
    subClub: SubClub;
    name: string;
    start: string;
    end: string;
    minCapacity?: number;
    maxCapacity?: number;
    note?: string;
    contactEmail: string;
    contactPhoneNumber: string;
    address: string;
    price?: number;
    distance?: number;
    zipCode: string;
    geoLocation: {
        type: 'Point';
        coordinates: number[];
    };
    repeatedWeeks: number;
    isLimitedUsageForNonMember?: boolean;
    maxFacilityUsagePerMonthForNonMember?: number;
    createdBy: 'club';
}

export interface UserDefinedFacilityResource {
    clubName: string;
    name: string;
    state: string;
    county: string;
    city: string;
    createdBy: 'user';
}

export interface Guest {
    _id: string;
    subClub: string;
    user: string;
    expirationDate: number;
    isReqMembership: boolean;
    status: GUEST_STATUS;
}
