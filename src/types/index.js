import * as yup from 'yup';
import { createdAt, updatedAt } from './commons';

export const recordSchema = yup.object({
    recordId: yup.number().required(),
    tenementNo: yup.string().required(),
    wardNo: yup.number(),
    projectName: yup.string().required(),
    oldTenementNo: yup.string().required(),
    ownerName: yup.string().required(),
    ownerMobileNo: yup.string().required(),
    occupierName: yup.string().required(),
    occupierMobileNo: yup.string().required(),
    propertyAddress: yup.string().required(),
    status: yup.string().required(),
    resurveyStatus: yup.string().nullable(),
    createdAt,
    updatedAt
});

export const ownerInfoSchema = yup.object({
    ownerInfoId: yup.number(),
    ownerSurveyName: yup.string().required(),
    isOwnerSurveyRecordPer: yup.bool().required(),
    occupierSurveyName: yup.string().required(),
    isOccupierSurveyRecordPer: yup.bool().required(),
    addressSurvey: yup.string().required(),
    isAddressSurveyRecordPer: yup.bool().required(),
    occupancyType: yup.string().required(),
    citySurveyNumber: yup.string().optional(),
    tpNumber: yup.string().optional(),
    revenueSurveyNumber: yup.string().optional(),
    mobileNumber: yup.string().optional(),
    createdAt,
    updatedAt,
    recordId: yup.number().required()
});

export const propertyInfoSchema = yup.object({
    propertyInfoId: yup.number(),
    propertyType: yup.string().required(),
    propertyDescription: yup.string().required(),
    isGovernmentProperty: yup.bool().required(),
    newCode: yup.string().optional(),
    numberOfWaterConnections: yup.number().required(),
    numberOfGutterConnections: yup.number().required(),
    isBorewellAvailable: yup.bool().required(),
    yearOfConstruction: yup.number().required(),
    createdAt,
    updatedAt,
    recordId: yup.number().required()
});

export const propertyInfoDataSchema = yup.object({
    isLoaded: yup.bool().required(),
    infoExists: yup.bool().required(),
    data: propertyInfoSchema
});

export const businessInfoSchema = yup.object({
    businessInfoId: yup.number(),
    organizationName: yup.string().required(),
    ownerName: yup.string().required(),
    isOwnerSurveyRecordPer: yup.bool().required(),
    organizationAddress: yup.string().required(),
    isAddressSurveyRecordPer: yup.bool().required(),
    shopActLicenseNumber: yup.string().optional(),
    businessType: yup.string().required(),
    businessStartDate: yup.date(),
    panCardNumber: yup.string().optional(),
    organizationTurnover: yup.number().required(),
    balanceSheetTotal: yup.number().required(),
    totalEmployees: yup.number().required(),
    createdAt,
    updatedAt,
    recordId: yup.number().required()
});

export const planInfoSchema = yup.object({
    planName: yup.string().optional(),
    length: yup.number().required(),
    width: yup.number().required(),
    area: yup.number().required(),
    floorName: yup.string().nullable(),
    createdAt,
    updatedAt: yup.date().nullable()
});

export const planInfoListSchema = yup.array(planInfoSchema).ensure();
export const recordListSchema = yup.array(recordSchema).ensure();

export const floorInfoSchema = yup.object({
    floorInfoId: yup.number(),
    floorName: yup.string().required(),
    totalSqFt: yup.number().required(),
    plans: planInfoListSchema,
    createdAt,
    updatedAt,
    recordId: yup.number().required()
});

export const floorInfoListSchema = yup.array(floorInfoSchema).ensure();
