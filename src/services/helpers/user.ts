import { Circle, ClubEvent, SubClub } from '@services/models';
import { getActiveRealVenues, isReqSubscription } from './club';
import { ELIGIBLE_GENDERS, GENDER, SUBSCRIPTION_STATUS } from '@shared/constants';
import store from '@store';
import moment from 'moment';
import { isMemberOfCircle, isOnlyCircleEvent, isOnlyGuestEvent } from './clubevent';
import { PermissionCheckResult } from '@services/types';

export const getMemberTypeName = (memberType: string) => {
    return store.getState().club.memberTypes.find((x) => x._id === memberType)?.name;
};

export const isCheckInSponsor = () => {
    const club = store.getState().club.club;
    const user = store.getState().auth.user;
    if (!club || !user) return false;
    return getActiveRealVenues(club).some(
        (x) => x.setting?.ruleSettings?.isRequireCheckIn && x.setting?.checkInSponsor === user._id
    );
};

export const getCheckInVenues = () => {
    const club = store.getState().club.club;
    const user = store.getState().auth.user;
    if (!club || !user) return [];
    return getActiveRealVenues(club).filter(
        (x) => x.setting?.ruleSettings?.isRequireCheckIn && x.setting?.checkInSponsor === user._id
    );
};

/**
 * Check Subscription
 * @returns
 */

export const checkSubscription = (): PermissionCheckResult => {
    const user = store.getState().auth.user;
    const club = store.getState().club.club;
    if (!user || !club) return { valid: false, message: '' };

    // check subscription
    if (!isReqSubscription(club)) return { valid: true };
    if (!user.subscription?.id)
        return {
            valid: false,
            message: `You need to subscribe to ${club.displayName}`,
            primaryButtonLabel: 'Subscribe',
            secondaryButtonLabel: 'No',
            reason: 'subscribe',
        };
    else if (
        user.subscription.status !== SUBSCRIPTION_STATUS.ACTIVE ||
        !user.subscription?.nextPaymentDate ||
        moment().isAfter(moment(new Date(user.subscription?.nextPaymentDate)).endOf('day'))
    )
        return {
            valid: false,
            message: `Your subscription for ${club.displayName} has been expired. Please subscribe again.`,
            primaryButtonLabel: 'Subscribe',
            secondaryButtonLabel: 'No',
            reason: 'subscribe',
        };

    return { valid: true };
};

/**
 * Check permission for circle
 * @param circle
 * @returns
 */
export const checkPermissionForCircle = (
    circle?: Circle
): {
    valid: boolean;
    message?: string;
    primaryButtonLabel?: string;
    secondaryButtonLabel?: string;
    reason?: string;
} => {
    const user = store.getState().auth.user;
    const club = store.getState().club.club;
    if (!circle || !user || !club) return { valid: false, message: '' };

    // check guest permission
    if (circle.subClub) {
        const checkResult = checkGuestPermissionForSubClub(circle.subClub as SubClub);
        if (!checkResult.valid) return checkResult;
    } else {
        const checkResult = checkSubscription();
        if (!checkResult.valid) return checkResult;
    }
    return checkEligibiliyForCircle(circle);
};

export const checkEligibiliyForCircle = (circle: Circle) => {
    const user = store.getState().auth.user;
    if (!user) return { valid: false, message: '' };

    // check eligible gender
    if (circle.eligibleGender && circle.eligibleGender !== ELIGIBLE_GENDERS.MIXED) {
        if (
            (circle.eligibleGender === ELIGIBLE_GENDERS.MALE && user.gender !== GENDER.MALE) ||
            (circle.eligibleGender === ELIGIBLE_GENDERS.FEMALE && user.gender !== GENDER.FEMALE)
        )
            return {
                valid: false,
                message: `This circle is only for ${circle.eligibleGender}.`,
                primaryButtonLabel: 'Update Profile',
                secondaryButtonLabel: 'No',
                reason: 'profile',
            };
    }
    // check eligible game level
    if (
        circle.eligibleLevel &&
        (!user.gameLevel || user.gameLevel < circle.eligibleLevel.from || user.gameLevel > circle.eligibleLevel.to)
    ) {
        return {
            valid: false,
            message: `This circle is only for level ${circle.eligibleLevel.from} ~ ${circle.eligibleLevel.to} members.`,
            primaryButtonLabel: 'Update Profile',
            secondaryButtonLabel: 'No',
            reason: 'profile',
        };
    }
    // check age range
    if (circle.ageRanges && circle.ageRanges.length > 0 && !user.age) {
        return {
            valid: false,
            message: `This circle is only for ${circle.ageRanges.join(', ')} members.`,
            primaryButtonLabel: 'Update Profile',
            secondaryButtonLabel: 'No',
            reason: 'profile',
        };
    }
    return { valid: true };
};

export const checkGuestPermissionForSubClub = (subClub: SubClub) => {
    const user = store.getState().auth.user;
    const myGuestAccounts = store.getState().club.myGuestAccounts;
    if (!user) return { valid: false, message: '' };

    const guest = myGuestAccounts.find((x) => x.subClub === (typeof subClub === 'string' ? subClub : subClub._id));
    if (!guest)
        return {
            valid: false,
            message: `This circle is only for guests of ${subClub.name}`,
            primaryButtonLabel: 'Ok',
            reason: 'shouldBeGuest',
        };
    if (guest.isReqMembership) return checkSubscription();
    return { valid: true };
};

/**
 * check permission for event
 * @param event
 * @returns
 */
export const checkPermissionForEvent = (event?: ClubEvent): PermissionCheckResult => {
    const user = store.getState().auth.user;
    const club = store.getState().club.club;
    const myGuestAccounts = store.getState().club.myGuestAccounts;
    if (!event || !user || !club) return { valid: false, message: '' };

    // if event is only for guests of club, resort or hotel
    if (isOnlyGuestEvent(event)) {
        const guest = myGuestAccounts.find((x) => event.resource?.subClub?._id === x.subClub);
        if (guest) {
            if (guest.isReqMembership) {
                let checkResult = checkSubscription();
                if (!checkResult.valid) return checkResult;
            }
            return checkEligibiliyForEvent(event);
        }
        return {
            valid: false,
            message: `This event is only for guests of ${event.resource?.subClub?.name}`,
            primaryButtonLabel: 'Ok',
            reason: 'shouldBeGuest',
        };
    }
    if (isOnlyCircleEvent(event)) {
        if (isMemberOfCircle(event.invitedCircles ?? [])) {
            const guestInvitedCircles = (event.invitedCircles ?? []).filter((x) => !!x.subClub);
            const myMatchedGuestAccounts = myGuestAccounts.filter((x) =>
                guestInvitedCircles.some(
                    (v) => (typeof v.subClub === 'string' ? v.subClub : v.subClub?._id) === x.subClub
                )
            );
            if (myMatchedGuestAccounts.length > 0 && !myMatchedGuestAccounts.some((x) => !x.isReqMembership)) {
                const checkResult = checkSubscription();
                if (!checkResult.valid) return checkResult;
            }
            return checkEligibiliyForEvent(event);
        } else {
            const noGuestCircles = (event.invitedCircles ?? []).filter((x) => !x.subClub);
            if (noGuestCircles.length > 0) {
                let checkResult = checkSubscription();
                if (!checkResult.valid) return checkResult;
                if (noGuestCircles.length === 1) {
                    return {
                        valid: false,
                        message: `This event is only for ${noGuestCircles[0].name} (Circle) members.`,
                        primaryButtonLabel: 'Join',
                        secondaryButtonLabel: 'No',
                        reason: 'one_circle_join',
                    };
                }
                return {
                    valid: false,
                    message: '',
                    reason: 'multi_circle_join',
                };
            } else {
                return {
                    valid: false,
                    message: `This event is only for members of ${(event.invitedCircles ?? [])
                        .map((x) => x.name)
                        .join(
                            ', '
                        )} Circle. This circles is only for guests. \n If you are already guest for this club, resort or hotel, Please join to circle.`,
                    primaryButtonLabel: 'Ok',
                    reason: 'shouldBeGuest',
                };
            }
        }
    }
    let checkResult = checkSubscription();
    if (!checkResult.valid) return checkResult;
    return checkEligibiliyForEvent(event);
};

export const checkEligibiliyForEvent = (event: ClubEvent) => {
    const user = store.getState().auth.user;
    if (!user) return { valid: false, message: '' };

    // check eligible gender
    if (event.eligibleGender && event.eligibleGender !== GENDER.MIXED) {
        if (event.eligibleGender !== user.gender)
            return {
                valid: false,
                message: `This circle is only for ${event.eligibleGender}.`,
                primaryButtonLabel: 'Update Profile',
                secondaryButtonLabel: 'No',
                reason: 'profile',
            };
    }
    // check eligible game level
    if (
        event.eligibleLevel &&
        (!user.gameLevel || user.gameLevel < event.eligibleLevel.from || user.gameLevel > event.eligibleLevel.to)
    ) {
        return {
            valid: false,
            message: `This circle is only for level ${event.eligibleLevel.from} ~ ${event.eligibleLevel.to} members.`,
            primaryButtonLabel: 'Update Profile',
            secondaryButtonLabel: 'No',
            reason: 'profile',
        };
    }

    return { valid: true };
};
