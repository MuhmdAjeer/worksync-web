/* tslint:disable */
/* eslint-disable */
/**
 * Auth API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */



/**
 * 
 * @export
 * @interface UpdateIssueDto
 */
export interface UpdateIssueDto {
    /**
     * 
     * @type {string}
     * @memberof UpdateIssueDto
     */
    'title'?: string;
    /**
     * 
     * @type {string}
     * @memberof UpdateIssueDto
     */
    'description'?: string;
    /**
     * 
     * @type {string}
     * @memberof UpdateIssueDto
     */
    'priority'?: PriorityEnum;
    /**
     * 
     * @type {string}
     * @memberof UpdateIssueDto
     */
    'state'?: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof UpdateIssueDto
     */
    'assignees_id'?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof UpdateIssueDto
     */
    'label_ids'?: Array<string>;
    /**
     * 
     * @type {Date}
     * @memberof UpdateIssueDto
     */
    'start_date'?: Date;
    /**
     * 
     * @type {Date}
     * @memberof UpdateIssueDto
     */
    'end_date'?: Date;
}

/**
    * @export
    * @enum {string}
    */
export enum PriorityEnum {
    Urgent = 'Urgent',
    High = 'High',
    Medium = 'Medium',
    Low = 'Low',
    None = 'None'
}


