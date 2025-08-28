import cloneDeep from 'lodash/cloneDeep';
import filter from 'lodash/filter';
import some from 'lodash/some';
import values from 'lodash/values';
import toString from 'lodash/toString';
import orderBy from 'lodash/orderBy';
import groupBy from 'lodash/groupBy';
import debounce from 'lodash/debounce';
import includes from 'lodash/includes';
import toLower from 'lodash/toLower';
import map from 'lodash/map';
import startCase from 'lodash/startCase';
import upperCase from 'lodash/upperCase';
import head from 'lodash/head';
import uniq from 'lodash/uniq';
import flatten from 'lodash/flatten';
import merge from 'lodash/merge';
import range from 'lodash/range';
import isString from 'lodash/isString';

export interface DataProcessingOptions {
  sortBy?: string;
  filterBy?: string;
  groupBy?: string;
  debounceMs?: number;
}

// Using lodash functions - but importing the whole library kills bundle size
export const processTableData = (data: Record<string, unknown>[], options: DataProcessingOptions = {}) => {
  const { sortBy, filterBy, groupBy: groupByKey } = options;
  
  let processed = cloneDeep(data);
  
  if (filterBy) {
    processed = filter(processed, item => 
      some(values(item), value => 
        toString(value).toLowerCase().includes(filterBy.toLowerCase())
      )
    );
  }
  
  if (sortBy) {
    processed = orderBy(processed, [sortBy], ['asc']);
  }
  
  if (groupByKey) {
    return groupBy(processed, groupByKey);
  }
  
  return processed;
};

export const debouncedSearch = debounce((query: string, callback: (results: typeof mockData) => void) => {
  // Simulate API call
  const results = filter(mockData, item => 
    includes(toLower(item.name), toLower(query))
  );
  callback(results);
}, 300);

interface UserInput {
  firstName?: string;
  lastName?: string;
  permissions?: { roles: string[] }[];
}

export const formatUserData = (users: UserInput[]) => {
  return map(users, user => ({
    ...user,
    fullName: startCase(toLower(`${user?.firstName || ''} ${user?.lastName || ''}`)),
    initials: upperCase(String(head(user?.firstName) || '') + String(head(user?.lastName) || '')),
    roles: uniq(flatten(user.permissions?.map((p) => p.roles) || [])),
  }));
};

export const mergeSettings = <T extends Record<string, unknown>>(defaultSettings: T, userSettings: Partial<T>) => {
  return merge({}, defaultSettings, userSettings);
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  return range(
    Math.max(1, currentPage - 2),
    Math.min(totalPages + 1, currentPage + 3)
  );
};

// Mock data for testing
const mockData = [
  { id: 1, name: 'John Doe', email: 'john@test.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@test.com' },
  { id: 3, name: 'Bob Johnson', email: 'bob@test.com' },
];

export const sortArrayAscending = (arr: number[]) => {
  // Sort array in ascending order
  return orderBy(arr, [], ['asc']);
};

export const validateEmailFormat = (email: string): boolean => {
  // Check if email is valid format
  return isString(email) && includes(email, '@');
};

export const calculateDiscountedPrice = (originalPrice: number, discountPercent: number): number => {
  // Apply discount percentage to get final price
  return originalPrice - (originalPrice * discountPercent / 100);
};