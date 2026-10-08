import React from 'react';
import { LayoutContainer, Button, Input, Select, Option } from '@/shared/ui/components';
import { Search, Plus } from 'lucide-react';
import { ADMIN_TEXTS } from '../../../constants/admin.constants';

interface UsersFilterBarProps {
  search: string;
  setSearch: (value: string) => void;
  roleFilter: string;
  setRoleFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  onAddUser: () => void;
  availableRoles: any[];
}

export const UsersFilterBar = ({ 
  search, setSearch, 
  roleFilter, setRoleFilter, 
  statusFilter, setStatusFilter, 
  onAddUser,
  availableRoles
}: UsersFilterBarProps) => {
  return (
    <LayoutContainer className="flex flex-col xl:flex-row justify-between gap-4 mt-8 w-full min-w-0">
      <LayoutContainer className="flex flex-col sm:flex-row gap-4 w-full flex-1">
        {/* Search */}
        <LayoutContainer className="w-full sm:flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 z-10" />
          <Input 
            type="text" 
            placeholder={ADMIN_TEXTS.USERS_SEARCH_PLACEHOLDER}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 w-full"
          />
        </LayoutContainer>

        {/* Filters */}
        <LayoutContainer className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <LayoutContainer className="w-full sm:w-48">
            <Select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <Option value="">{ADMIN_TEXTS.USERS_FILTER_ROLES_ALL}</Option>
              {availableRoles.map((r: any, index: number) => {
                let roleId = r.name || `role-${index}`;
                if (typeof r._id === 'string') roleId = r._id;
                else if (r._id && typeof r._id.toString === 'function' && r._id.toString() !== '[object Object]') roleId = r._id.toString();

                return (
                  <Option key={roleId} value={roleId}>
                    {r.label || r.name}
                  </Option>
                );
              })}
            </Select>
          </LayoutContainer>

          <LayoutContainer className="w-full sm:w-48">
            <Select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <Option value="ALL">{ADMIN_TEXTS.USERS_FILTER_STATUS_ALL}</Option>
              <Option value="ACTIVE">{ADMIN_TEXTS.USERS_FILTER_STATUS_ACTIVE}</Option>
              <Option value="PENDING">{ADMIN_TEXTS.USERS_FILTER_STATUS_PENDING}</Option>
              <Option value="BLOCKED">{ADMIN_TEXTS.USERS_FILTER_STATUS_BLOCKED}</Option>
              <Option value="INACTIVE">{ADMIN_TEXTS.USERS_FILTER_STATUS_INACTIVE}</Option>
            </Select>
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>

      {/* Action Button */}
      <Button variant="primary" size="md" onClick={onAddUser} className="w-full xl:w-auto flex items-center justify-center gap-2 flex-shrink-0 h-[42px]">
        <Plus size={18} />
        {ADMIN_TEXTS.USER_DRAWER_TITLE_CREATE}
      </Button>
    </LayoutContainer>
  );
};
