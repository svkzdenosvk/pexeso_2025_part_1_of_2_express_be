"use strict";
/**
 * Generic Utility Functions
 * -------------------------
 * Collection of reusable helper functions for common tasks used across the project.
 *
 * Purpose:
 *   - Provide core reusable logic that is not specific to any single module.
 *   - Keep the codebase DRY by centralizing common utilities.
 *
 * Contents:
 *   - _shuffleArray()             → Randomly shuffles an array using Fisher–Yates.
 *   - _myFormatSeconds()          → Formats seconds into a readable "Xm Ys" string.
 *   - _myToggle()                 → Toggles CSS classes on a DOM element.
 *   - my_Type_Guard_function()    → Type guard for narrowing strings to literal types.
 *   - my_Type_Guard_function_number() → Type guard for narrowing numbers to literal types.
     - isMy_Type_User() -> Type guard validate object type My_Type_User
 *
 * Usage:
 *   - Import only what is needed in each module.
 *   - Designed to work in both browser and Node.js environments.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports._shuffleArray = _shuffleArray;
exports._myFormatSeconds = _myFormatSeconds;
exports._myToggle = _myToggle;
exports.my_Type_Guard_function = my_Type_Guard_function;
exports.my_Type_Guard_function_number = my_Type_Guard_function_number;
exports.isLike_My_Type_User = isLike_My_Type_User;
/**
 * Randomly shuffles the elements of an array using the Fisher–Yates algorithm.
 *
 * Workflow:
 * 1. Create a shallow copy of the input array to avoid mutation.
 * 2. Iterate backward through the array.
 * 3. Swap each element with a randomly selected earlier element.
 *
 * @param arrayIn - The input array to shuffle.
 * @returns A new array with the elements in randomized order.
 */
function _shuffleArray(arrayIn) {
    // Copy array to avoid mutating the original
    let array = [...arrayIn];
    // Iterate from the last element backwards
    for (let i = array.length - 1; i > 0; i--) {
        // Pick a random index from 0 to i
        const j = Math.floor(Math.random() * (i + 1));
        // Swap elements at positions i and j
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
/*--------------------------------------------------------------------------*/
/**
 * Formats a duration (in seconds) into a human-readable string.
 *
 * Handles zero-minute cases gracefully (e.g. "45s" instead of "0m 45s").
 *
 * @param seconds - The total number of seconds.
 * @returns A string in the format "Xm Ys" or "Ys" if minutes are zero.
 */
function _myFormatSeconds(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const minPart = minutes > 0 ? `${minutes}m ` : '';
    const secPart = `${remainingSeconds}s`;
    return minPart + secPart;
}
/*--------------------------------------------------------------------------*/
/**
 * Toggles CSS classes on a DOM element.
 *
 * @param elm - The target HTML element.
 * @param removedClass - The class name to remove.
 * @param addedClass - The class name to add.
 */
function _myToggle(elm, removedClass, addedClass) {
    elm.classList.add(addedClass);
    elm.classList.remove(removedClass);
}
/*--------------------------------------------------------------------------*/
/**
 * Type guard for narrowing down string values to a specific string literal type.
 *
 * @param value - The string value to check.
 * @param arr - The readonly array of allowed string literal values.
 * @returns True if the value is included in the allowed list, false otherwise.
 */
function my_Type_Guard_function(value, arr) {
    return arr.includes(value);
}
/*--------------------------------------------------------------------------*/
/**
 * Type guard for narrowing down numeric values to a specific numeric literal type.
 *
 * @param value - The numeric value to check.
 * @param arr - The readonly array of allowed numeric literal values.
 * @returns True if the value is included in the allowed list, false otherwise.
 */
function my_Type_Guard_function_number(value, arr) {
    return arr.includes(value);
}
function isLike_My_Type_User(obj) {
    return (obj &&
        typeof obj.id === 'number' &&
        typeof obj.email === 'string' &&
        typeof obj.name === 'string');
}
