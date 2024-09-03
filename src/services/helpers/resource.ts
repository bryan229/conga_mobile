import { FacilityResource, UserDefinedFacilityResource } from '@services/models';

export const isUserDefinedResource = (
    resource: FacilityResource | UserDefinedFacilityResource
): resource is UserDefinedFacilityResource => resource.createdBy === 'user';
