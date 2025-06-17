import moment from "moment";

export const fromNow = (date: string | undefined): string => {
  if(!date) return ''
  return moment.utc(date).local().fromNow()
};

export const formatDate = (date: string | undefined): string => {
  if (!date) return ''
  return moment.utc(date).local().format('L')
}
