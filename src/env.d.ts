/// <reference types="astro/client" />

import type { AppUser } from './lib/app/types';

declare namespace App {
  interface Locals {
    user: AppUser;
  }
}
