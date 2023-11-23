import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, BeforeInsert, OneToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { Game } from 'src/games/games.entity';
import { Transaction } from 'src/transactions/transactions.entity';
import { DailyStats } from 'src/stats/dailyStats.entity';
import { TotalStats } from 'src/stats/totalStats.entity';

@Entity({ name: 'accounts' })
export class Account {
  @PrimaryGeneratedColumn() id: number;

  @CreateDateColumn() created_at: Date;

  @Column({ unique: true }) username: string;

  @Exclude()
  @Column() password: string;

  @Column({ default: '' }) email: string;

  @Column({ default: 0 }) gems: number;

  @Column({ default: false }) subscription: boolean;

  @Column({ nullable: true }) subscription_start_date: Date;

  @Column({ default: false }) is_v1: boolean;

  @Column({ default: 0 }) profile_views: number;
  
  @OneToMany(() => Transaction, transaction => transaction.account)
  transactions: Transaction[];

  @OneToMany(() => DailyStats, stats => stats.account)
  daily_stats: DailyStats[];

  @OneToOne(() => TotalStats, stats => stats.account)
  total_stats: TotalStats;

  @OneToMany(() => Game, game => game.account)
  games: Game[];

  constructor(data: Partial<Account> = {}) {
    Object.assign(this, data);
  }

  @BeforeInsert()
  async hashPassword() {
    if (!/^\$2[abxy]?\$\d+\$/.test(this.password)) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async checkPassword(plainPassword: string) {
    return await bcrypt.compare(plainPassword, this.password);
  }
}