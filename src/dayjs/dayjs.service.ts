import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

@Injectable()
export class DayjsService {
  // DB 저장용 현재 시간
  async now() {
    const dbNow = () => dayjs().add(9, 'hour').toDate();
    const now = dbNow();
    return now;
  }

  async tomorrow(now) {
    const tomorrow = dayjs(now).add(1, 'day');
    return tomorrow;
  }

  async laterDays(now, n) {
    const laterDay = dayjs(now).add(n, 'day');
    return laterDay;
  }

  // where절 사용을 위한 date 생성
  async startDate(date) {
    return dayjs.utc(date).startOf('day').toDate();
  }

  async endDate(date) {
    return dayjs.utc(date).endOf('day').toDate();
  }
}
