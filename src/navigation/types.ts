import {
    Request,
    Circle,
    CircleMessage,
    User,
    Club,
    FacilityResource,
    UserDefinedFacilityResource,
} from '@services/models';
import { CircleQuery, CongaClubEventQuery, OrganizationQuery, ResourceQuery } from '@services/types';

export type RootStackParamList = {
    Login?: {
        canBack?: boolean;
    };
    Register: {
        club?: Club;
    };
    Verify: {
        user: User;
        club: Club;
    };
    Subscription: {
        user: User;
        club: Club;
    };
    Init:
    | {
        initScreen?: keyof InitStackParamList;
    }
    | undefined;
    Home: { initScreen?: keyof HomeStackParamList } | undefined;
    Account: undefined;
    ScanQRCode: undefined;
    CheckIn: {
        venue?: string;
        court?: number;
    };
    Profile: undefined;
    Settings: undefined;
    Posts: undefined;
    Opponents: undefined;
    ChatList: undefined;
    ChatRoom: {
        partner: User;
    };
    Resources: undefined;
    NewCircle: undefined;
    CreateNewEvent: {
        circleMessage?: CircleMessage;
    };
    EditClubEvent: {
        eventId: string;
    };
    RequestClubEvent: {
        circleMessage: CircleMessage;
    };
    CircleMessage: {
        initScreen?: keyof CircleMessageStackParamList;
        circleId: string;
        messageId?: string;
        commentId?: string;
        resourceId?: string;
    };
    SearchResources: {
        callback?: (resource: FacilityResource) => void;
    };
    StripeCheckout: {
        sessionId: string;
    };
    EventSearchPanel: {
        title?: string;
        query: CongaClubEventQuery;
        onChange: (query: CongaClubEventQuery) => void;
    };
    ResourceSearchPanel: {
        title?: string;
        query: ResourceQuery;
        onChange: (query: ResourceQuery) => void;
    };
    OrganizationSearchPanel: {
        title?: string;
        query: OrganizationQuery;
        onChange: (query: OrganizationQuery) => void;
    };
    CircleSearchPanel: {
        title?: string;
        query: CircleQuery;
        onChange: (query: CircleQuery) => void;
    };
    AddResource: {
        callback?: (resource: UserDefinedFacilityResource) => void;
    };
};

export type HomeStackParamList = {
    Clubs: undefined;
    Messages: undefined;
    ClubEvents: any;
    Requests: undefined;
    Reservations: {
        defaultScreen?: RouteName;
    };
    Scan: undefined;
    // Resources: undefined;
    Circles:
    | {
        initScreen?: keyof CircleStackParamList;
    }
    | undefined;
    Organizations: undefined;
};

export type InitStackParamList = {
    HotEvents: undefined;
    MyClubs: undefined;
};

export type ClubEventStackParamList = {
    ClubEventList: { groupId?: string };
    RegisteredEvents: undefined;
    CreateEvent: undefined;
    SponsorEvents: undefined;
};

export type RequestStackParamList = {
    RequestTab: undefined;
};

export type RequestTabStackParamList = {
    Requests: undefined;
    SubmitRequest: {
        request?: Request;
    };
};
export type ScheduleStackParamList = {
    ScheduleTab: undefined;
};

export type ScheduleTabStackParamList = {
    MySchedules: undefined;
    CheckInSchedules: undefined;
    SubmitSchedule: undefined;
};

export type PostStackParamList = {
    PostTab: undefined;
};

export type PostTabStackParamList = {
    Posts: undefined;
    MyPosts: undefined;
};

export type CircleStackParamList = {
    MyCircles: undefined;
    Invitations: undefined;
    CircleList: undefined;
};

export type CircleMessageStackParamList = {
    CircleMessageList: { circle: Circle; messageId?: string; commentId?: string };
    CircleInfo: { circle: Circle };
    NewMessage: { circle: Circle; resourceId?: string };
};

export type StackParamList = RootStackParamList &
    HomeStackParamList &
    RequestTabStackParamList &
    ScheduleTabStackParamList &
    PostStackParamList &
    PostTabStackParamList &
    CircleStackParamList &
    CircleMessageStackParamList &
    InitStackParamList;

export type RouteName = keyof StackParamList;
