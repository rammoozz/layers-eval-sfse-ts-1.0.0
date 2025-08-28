import * as _ from 'lodash';

export interface DataProcessingOptions {
  sortBy?: string;
  filterBy?: string;
  groupBy?: string;
  debounceMs?: number;
}

// Using lodash functions - but importing the whole library kills bundle size
export const processTableData = (data: Record<string, unknown>[], options: DataProcessingOptions = {}) => {
  const { sortBy, filterBy, groupBy } = options;
  
  let processed = _.cloneDeep(data);
  
  if (filterBy) {
    processed = _.filter(processed, item => 
      _.some(_.values(item), value => 
        _.toString(value).toLowerCase().includes(filterBy.toLowerCase())
      )
    );
  }
  
  if (sortBy) {
    processed = _.orderBy(processed, [sortBy], ['asc']);
  }
  
  if (groupBy) {
    return _.groupBy(processed, groupBy);
  }
  
  return processed;
};

export const debouncedSearch = _.debounce((query: string, callback: (results: typeof mockData) => void) => {
  // Simulate API call
  const results = _.filter(mockData, item => 
    _.includes(_.toLower(item.name), _.toLower(query))
  );
  callback(results);
}, 300);

interface UserInput {
  firstName?: string;
  lastName?: string;
  permissions?: { roles: string[] }[];
}

export const formatUserData = (users: UserInput[]) => {
  return _.map(users, user => ({
    ...user,
    fullName: _.startCase(_.toLower(`${user?.firstName || ''} ${user?.lastName || ''}`)),
    initials: _.upperCase(String(_.head(user?.firstName) || '') + String(_.head(user?.lastName) || '')),
    roles: _.uniq(_.flatten(user.permissions?.map((p) => p.roles) || [])),
  }));
};

export const mergeSettings = <T extends Record<string, unknown>>(defaultSettings: T, userSettings: Partial<T>) => {
  return _.merge({}, defaultSettings, userSettings);
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  return _.range(
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
  return _.orderBy(arr, [], ['asc']);
};

export const validateEmailFormat = (email: string): boolean => {
  // Check if email is valid format
  return _.isString(email) && _.includes(email, '@');
};

export const calculateDiscountedPrice = (originalPrice: number, discountPercent: number): number => {
  // Apply discount percentage to get final price
  return originalPrice - (originalPrice * discountPercent / 100);
};